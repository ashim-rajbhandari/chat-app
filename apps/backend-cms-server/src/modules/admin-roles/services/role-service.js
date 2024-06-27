const BaseService = require('backend-cms/src/modules/base/services/base.service');
const {
  role,
  permission,
  userRole,
  admin
} = require('shared/src/database/models');
const modules = require('backend-cms/src/config/cmsConfig').modulePermissions;
const { groupBy } = require('lodash');
const db = require('shared/src/config/database').postgres;
class RoleService extends BaseService {
  constructor(opts) {
    super(role);
    this.adminService = opts.adminService;
    this.filterFields = ['name', 'slug'];
  }

  getData(req) {
    const payload = {
      ...this.buildFilterQuery(req),
      order: [['created_at', 'DESC']],
      page: req.query.page ?? 1,
      include: [{ model: userRole, as: 'roleUsers' }]
    };
    return this.getPaginatedData(payload);
  }

  async indexPageData(req) {
    return {
      ...(await this.getData(req)),
      userData: await this.adminService.getDropDownData()
    };
  }

  getAll(req) {
    const payload = {
      ...this.buildFilterQuery(req),
      order: [['created_at', 'DESC']]
    };
    return this.findAll(payload);
  }

  async findPermissions(query) {
    return permission.findAll({
      where: query.where,
      offset: query.offset,
      limit: query.limit,
      order: query.order
    });
  }

  async permissionTojson() {
    const permissions = await this.findPermissions({
      order: [['slug', 'DESC']]
    });
    const groupedPermission = groupBy(permissions, 'module');
    let allPermissions = {};
    for (let key in modules) {
      if (
        Object.prototype.hasOwnProperty.call(modules, key) &&
        Object.prototype.hasOwnProperty.call(groupedPermission, key)
      ) {
        allPermissions[key] = groupedPermission[key];
      }
    }
    return allPermissions;
  }
  async findOne(query) {
    const docs = await this.model.findOne(query);
    return {
      docs
    };
  }
  async delete(id) {
    return this.model.destroy({ where: { id: id } });
  }

  async addUsers(users, roleId) {
    const trx = await db.transaction();
    try {
      const roleData = await role.findOne({ where: { id: roleId } });

      let mappedUsers = users;
      const arrayData = [];
      if (typeof users === 'string') {
        mappedUsers = [users];
      }
      await userRole.destroy({
        where: { role_id: roleId },
        transaction: trx
      });
      if (mappedUsers !== undefined) {
        for (let user of mappedUsers) {
          await admin.update(
            { role_id: null },
            {
              where: { id: user },
              individualHooks: true,
              transaction: trx
            }
          );
          const data = {
            user_id: parseInt(user),
            role_id: roleData.id,
            role_slug: roleData.slug
          };
          arrayData.push(data);
        }
      }
      await userRole.bulkCreate(arrayData, { transaction: trx });
      await trx.commit();
    } catch (err) {
      await trx.rollback();
      throw new Error(err);
    }
  }
}

module.exports = RoleService;
