const { groupBy } = require('lodash');
const modules = require('backend-cms/src/config/cmsConfig').modulePermissions;
const Controller = require('backend-cms/src/modules/base/controllers/baseController');
const { userRole } = require('shared/src/database/models');
class RoleController extends Controller {
  constructor(opts) {
    super(opts);
    this.service = opts.roleService;
    this.adminService = opts.adminService;
    this.title = 'Admin Roles';
    this.view = '../admin-roles';
    this.url = '/admin-roles';
    this.module = 'admins.roles.';
  }

  async addView(req, res) {
    try {
      this.innerPage = this.view + '/add';
      let allPermissions = await this.service.permissionTojson();
      const breadcrumbs = this.formBreadCrumb('Create');
      res.render(
        'layout/base-inner',
        this.viewData(
          { permission: allPermissions, breadcrumbs },
          'create',
          'Create Admin Role'
        )
      );
    } catch (error) {
      return res.redirect('back');
    }
  }

  async add(req, res) {
    try {
      req.body.permission = this.mappedPermission(req.body.permission);
      await this.service.create(req.body);
      req.flash('success_msg', 'Admin role added successfully.');
      return res.redirect(this.url);
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect(this.url);
    }
  }

  mappedPermission(permission) {
    return typeof permission === 'string' ? [permission] : permission;
  }

  async edit(req, res) {
    try {
      req.body.permission = this.mappedPermission(req.body.permission);
      await this.service.findAndUpdate(req.params.id, req.body);
      req.flash('success_msg', 'Admin role updated successfully');
      return res.redirect(this.url);
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect(this.url);
    }
  }

  async editView(req, res) {
    try {
      this.innerPage = this.view + '/edit';
      const permissions = await this.service.findPermissions({
        order: [['slug', 'DESC']]
      });
      const permission = groupBy(permissions, 'module');
      const breadcrumbs = this.formBreadCrumb('Edit', req?.session?.cancelUrl);
      let allPermissions = {};
      for (let key in modules) {
        if (
          Object.prototype.hasOwnProperty.call(modules, key) &&
          Object.prototype.hasOwnProperty.call(permission, key)
        ) {
          allPermissions[key] = permission[key];
        }
      }
      const role = await this.service.findOne({
        where: { _id: req.params.id }
      });
      res.render(
        'layout/base-inner',
        this.viewData(
          {
            role: role.docs,
            permission: allPermissions,
            breadcrumbs
          },
          'edit',
          'Edit Admin Role'
        )
      );
    } catch (error) {
      return res.redirect('back');
    }
  }

  async delete(req, res) {
    try {
      let countUsers = await this.adminService.count({
        where: { role_id: req.params.id }
      });
      let countUserRolesData = await userRole.count({
        where: { role_id: req.params.id }
      });

      if (countUsers > 0 || countUserRolesData > 0) {
        req.flash(
          'error_msg',
          'In order to delete role you need to delete all associated employees.'
        );
        return res.redirect('/admin-roles');
      }
      await this.service.delete(req.params.id);
      req.flash('success_msg', 'ADmin Role deleted successfully');
      return res.redirect(this.url);
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect('back');
    }
  }

  async addUsers(req, res) {
    try {
      const users = req.body.users;
      await this.service.addUsers(users, req.params.id);
      req.flash('success_msg', 'Successfully Added.');
      return res.redirect(this.url);
    } catch (error) {
      req.flash('error_msg', error.message);
      return res.redirect(this.url);
    }
  }
}

module.exports = RoleController;
