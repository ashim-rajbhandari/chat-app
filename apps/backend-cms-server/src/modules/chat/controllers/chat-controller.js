const {
  removeFile,
  bcryptPassword,
  getConfigData
} = require('shared/src/helpers');
const Controller = require('backend-cms/src/modules/base/controllers/baseController');
const { emitter } = require('backend-cms/src/listener');
const { createActivityLog } = require('backend-cms/src/helpers');
const LogMessage = require('backend-cms/src/constants');
class ChatController extends Controller {
  constructor(opts) {
    super(opts);
    this.service = opts.chatService;
    this.title = 'Chats';
    this.view = '../chat';
    this.url = '/chats';
    this.module = 'chats';
  }

  async index(req, res) {
    try {
      this.innerPage = this.view + '/index';
      const data = await this.service.indexPageData(req);
      data.adminId = req?.session?.user?.id;
      data.adminUserName = req?.session?.user?.username;
      data.breadcrumbs = this.indexBreadCrumb();
      req.session.cancelUrl = req.originalUrl;
      return res.render(
        'layout/base-inner',
        this.viewData(data, this.module + 'view')
      );
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect(this.url);
    }
  }

  async addView(req, res) {
    try {
      this.innerPage = this.view + '/add';
      const roles = await this.roleService.getAll(req);
      const breadcrumbs = this.formBreadCrumb('Create');

      const createPageData = {
        roles: roles.docs,
        breadcrumbs: breadcrumbs
      };
      res.render(
        'layout/base-inner',
        this.viewData(createPageData, this.module + 'create', 'Add Admin')
      );
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect(this.url);
    }
  }

  async add(req, res) {
    try {
      const data = await this.service.createUser(req, req.session.user);
      createActivityLog(
        req.session?.user?.id,
        `${LogMessage.ADD_ADMIN} ${data.id}: ${data._id}`
      );
      req.flash('success_msg', 'Admin added successfully.');
      return res.redirect(this.url);
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect(this.url + '/create');
    }
  }

  async editView(req, res) {
    try {
      this.innerPage = this.view + '/edit';
      const adminData = await this.service.findOne({
        where: { _id: req.params.id }
      });
      const rolesPromise = this.roleService.getAll(req);
      const userRolesIdsPromise = this.service.selectedRoleIds(adminData.id);
      const [roles, userRolesIds] = await Promise.all([
        rolesPromise,
        userRolesIdsPromise
      ]);
      const breadcrumbs = this.formBreadCrumb('Edit', req?.session?.cancelUrl);
      const editPageData = {
        roles: roles.docs,
        admin: adminData,
        selectedRoles: userRolesIds,
        breadcrumbs: breadcrumbs
      };
      res.render(
        'layout/base-inner',
        this.viewData(editPageData, this.module + 'edit', 'Edit Admin')
      );
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect(this.url);
    }
  }

  async edit(req, res) {
    try {
      const data = await this.service.updateUser(req, req.session.user);
      createActivityLog(
        req.session?.user?.id,
        `${LogMessage.UPDATE_ADMIN} ${data?.[1]?.[0]?.id}: ${data?.[1]?.[0]?._id}`
      );
      req.flash('success_msg', 'Admin updated successfully');
      return res.redirect(this.url);
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect(this.url);
    }
  }

  async delete(req, res) {
    try {
      let admin = await this.service.findOrFail(req.params.id);
      if (admin.image) {
        let rootDir = 'public/backend';
        removeFile(rootDir + admin.image);
      }
      await this.service.delete(req.params.id);
      createActivityLog(
        req.session?.user?.id,
        `${LogMessage.DELETE_ADMIN} ${admin?.id}: ${admin?._id}`
      );
      req.flash('success_msg', 'Admin deleted successfully');
      return res.redirect(this.url);
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect(this.url);
    }
  }

  async changePasswordView(req, res) {
    try {
      this.innerPage = this.view + '/changePassword';
      const admin = await this.service.findOne({
        where: { _id: req.params.id }
      });
      const breadcrumbs = this.formBreadCrumb('Change Password');
      return res.render(
        'layout/base-inner',
        this.viewData(
          { admin: admin, breadcrumbs },
          'password',
          'Change Password'
        )
      );
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect(this.url);
    }
  }

  async changePassword(req, res) {
    try {
      let showResetPassword = false;
      if (req.body.show_reset_password) {
        showResetPassword = true;
      }
      let hashround = 10;
      if (
        getConfigData(req, 'Password Hashing Rounds') &&
        getConfigData(req, 'Password Hashing Rounds') !== ''
      ) {
        hashround = parseInt(getConfigData(req, 'Password Hashing Rounds'));
      }
      const data = await this.service.findAndUpdate(req.params.id, {
        password: bcryptPassword(req.body.password, hashround),
        show_reset_password: showResetPassword,
        updated_at: new Date()
      });
      emitter.emit('notify-password-changed', {
        email: [data?.[1]?.[0]?.email],
        code: 'notify_password_changed',
        username: data?.[1]?.[0]?.employee_name,
        password: req.body.password
      });
      req.flash('success_msg', 'Password changed successfully');
      return res.redirect(this.url);
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect(this.url);
    }
  }
}

module.exports = ChatController;
