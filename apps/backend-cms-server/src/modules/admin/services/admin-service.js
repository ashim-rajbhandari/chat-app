const BaseService = require('backend-cms/src/modules/base/services/base.service');
const {
  admin,
  role,
  resetPasswordHistory,
  userRole
} = require('shared/src/database/models');
const randtoken = require('rand-token');
const PROTECTED_ATTRIBUTES = ['password'];
const {
  bcryptPassword,
  getConfigData,
  uploadFileToPath
} = require('shared/src/helpers');
const bcrypt = require('bcryptjs');
const { MAINSUPERADMIN } = require('shared/src/constants');
const db = require('shared/src/config/database').postgres;
const sequelize = require('sequelize');
const { Op } = sequelize;
const { emitter } = require('backend-cms/src/listener');
const config = require('config');
const cmsConf = config.get('cms');
class AdminService extends BaseService {
  constructor() {
    super(admin);
    this.filterFields = ['first_name', 'email'];
  }

  get emailService() {
    return this._emailService;
  }

  set emailService(value) {
    this._emailService = value;
  }

  getData(req) {
    const payload = {
      ...this.buildFilterQuery(req),
      order: [['created_at', 'DESC']],
      page: req.query.page ?? 1,
      include: [
        {
          model: userRole,
          as: 'userRoles',
          include: [
            {
              model: role,
              as: 'roleAdmin'
            }
          ]
        }
      ]
    };
    return this.getPaginatedData(payload);
  }

  async indexPageData(req) {
    return {
      ...(await this.getData(req))
    };
  }

  buildFilterQuery(req) {
    let filter = {};
    let keywordFilter = {};
    const { query } = req;
    if (!query) {
      return filter;
    }
    if (query) {
      if (query.keyword) {
        keywordFilter[Op.or] = this.buildKeywordQuery(query.keyword);
      }
    }
    const finalMappedFilter = {
      ...keywordFilter,
      ...filter
    };
    return { where: finalMappedFilter };
  }

  async create(data, trx) {
    return admin.create(data, { transaction: trx });
  }

  async findOne(query) {
    return admin.findOne({
      where: query.where,
      attributes: { exclude: PROTECTED_ATTRIBUTES }
    });
  }

  async findUserWithRole(query) {
    return admin.findOne({
      where: query.where,
      attributes: { exclude: PROTECTED_ATTRIBUTES },
      include: [
        {
          model: role,
          as: 'role',
          attributes: ['_id', 'name', 'slug', 'permission']
        }
      ]
    });
  }

  async findUserWithRoles(query) {
    return admin.findOne({
      where: query.where,
      attributes: { exclude: PROTECTED_ATTRIBUTES },
      include: [{ model: userRole, as: 'userRoles' }]
    });
  }

  async findAllUserWithRole(query) {
    return admin.findAll({
      where: query.where,
      attributes: { exclude: PROTECTED_ATTRIBUTES },
      include: [{ model: role, as: 'role' }]
    });
  }

  async selectedRoleIds(userid) {
    let roleIds = [];
    const data = await userRole.findAll({
      where: {
        user_id: userid
      },
      attributes: ['role_id']
    });
    data.map((item) => {
      roleIds.push(item.role_id);
    });
    return roleIds;
  }

  async delete(id) {
    const trx = await db.transaction();
    try {
      const adminData = await this.model.findOne({
        where: { _id: id }
      });
      if (adminData === null) {
        throw new Error('Data not found.');
      }
      if (adminData._id === MAINSUPERADMIN) {
        throw new Error('Main Superadmin data cannot be deleted.');
      }
      await userRole.destroy({
        where: {
          user_id: adminData.id
        },
        transaction: trx
      });
      await adminData.destroy({ transaction: trx });
      return await trx.commit();
    } catch (err) {
      await trx.rollback();
      throw new Error(err);
    }
  }

  async createUser(req) {
    const trx = await db.transaction();
    try {
      let newUser = this.parseAdminData(req.body, 'create');
      if (req.files) {
        newUser['image'] = uploadFileToPath({
          file: req.files.image,
          absDir: '/uploads/admins/',
          rootDir: 'public/backend'
        });
      }
      let passwordMethod = req.body.password_method;
      newUser['password_method'] = passwordMethod;
      let token = '';
      if (passwordMethod == 'is_activation_link') {
        let expiryDate = new Date().getTime() + 86400000;
        token = randtoken.generate(24);
        newUser['reset_password_token'] = token;
        newUser['reset_password_expires'] = new Date(expiryDate);
        newUser['status'] = 'active';
      } else {
        let hashround = 10;
        if (
          getConfigData(req, 'Password Hashing Rounds') &&
          getConfigData(req, 'Password Hashing Rounds') !== ''
        ) {
          hashround = parseInt(getConfigData(req, 'Password Hashing Rounds'));
        }
        newUser['password'] = bcryptPassword(req.body.password, hashround);
      }
      let adminData = await this.create(newUser, trx);
      await this.updateUserRoles(adminData.id, req.body.role_id, trx, 'create');
      await trx.commit();
      if (adminData && passwordMethod == 'is_activation_link') {
        emitter.emit('create-user', {
          email: [newUser.email],
          token: newUser.reset_password_token,
          username: newUser.username,
          code: 'email_verification',
          url:
            cmsConf.CMS_URL + '/reset-password/' + newUser.reset_password_token
        });
      }
      return adminData;
    } catch (err) {
      await trx.rollback();
      throw new Error(err);
    }
  }

  async updateUser(req) {
    const trx = await db.transaction();
    try {
      const userData = await this.findOne({
        where: { _id: req.params.id }
      });
      let updateData = this.parseAdminData(req.body, 'update');

      if (req.files) {
        updateData['image'] = uploadFileToPath({
          file: req.files.image,
          absDir: '/uploads/admins/',
          rootDir: 'public/backend',
          replacePreviousFile: { fileName: userData.image }
        });
      }
      let updatedUser = await admin.update(updateData, {
        where: { _id: req.params.id },
        individualHooks: true,
        transaction: trx
      });

      if (updatedUser[1][0]._id !== MAINSUPERADMIN) {
        await this.updateUserRoles(updatedUser[1][0].id, req.body.role_id, trx);
      }

      await trx.commit();
      if (updatedUser[1][0]._id == req.session.user._id) {
        req.session.user.first_name = updatedUser[1][0].first_name;
        req.session.user.last_name = updatedUser[1][0].last_name;
        req.session.user.image = updatedUser[1][0].image;
      }
      return updatedUser;
    } catch (e) {
      await trx.rollback();
      throw new Error(e);
    }
  }

  parseAdminData(data, action) {
    const parsed = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      username: data.username,
      contact_number: data.contact_number,
      status: data.status,
      mobile_num: data.mobile_num,
      remarks: data.remarks,
      fax: data.fax
    };
    if (action === 'create') {
      parsed['created_at'] = new Date();
    }
    if (action === 'update') {
      parsed['updated_at'] = new Date();
    }
    return parsed;
  }

  async updateUserRoles(userId, roles, trx, mode = 'edit') {
    let mappedRoles = roles;
    const arrayData = [];
    if (typeof roles === 'string') {
      mappedRoles = [roles];
    }
    if (mode === 'edit') {
      await userRole.destroy({
        where: { user_id: userId },
        transaction: trx
      });
    }
    for (let item of mappedRoles) {
      const roleData = await role.findOne({ where: { id: item } });
      const data = {
        user_id: userId,
        role_id: parseInt(item),
        role_slug: roleData.slug
      };
      arrayData.push(data);
    }
    return userRole.bulkCreate(arrayData, { transaction: trx });
  }

  async storePasswordHistory(payload, trx) {
    return resetPasswordHistory.create(payload, { transaction: trx });
  }

  async checkRecentOldPasswords(req, token, password) {
    let check = false;
    const adminData = await this.findOne({
      where: { reset_password_token: token }
    });
    let limit = 3;
    if (
      getConfigData(req, 'Past Password Usage Restrictions') &&
      getConfigData(req, 'Past Password Usage Restrictions') !== ''
    ) {
      limit = parseInt(getConfigData(req, 'Password Hashing Rounds'));
    }
    const passwordHistories = await resetPasswordHistory.findAll({
      where: { user_id: adminData._id },
      attributes: ['user_id', 'password'],
      limit: limit,
      order: [['created_at', 'DESC']]
    });

    const totalRecord = await resetPasswordHistory.count({
      where: { user_id: adminData._id }
    });

    for (let i = 0; i < totalRecord; i++) {
      if (passwordHistories[i]) {
        if (bcrypt.compareSync(password, passwordHistories[i].password)) {
          check = true;
          break;
        }
      }
    }
    return check;
  }

  async getDropDownData() {
    const filterObject = {
      where: {
        _id: {
          [Op.ne]: MAINSUPERADMIN
        }
      },
      attributes: ['id', 'first_name', 'last_name', 'status']
    };
    return this.model.findAll(filterObject);
  }
}

module.exports = AdminService;
