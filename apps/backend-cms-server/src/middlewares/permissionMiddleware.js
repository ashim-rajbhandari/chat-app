const _ = require('lodash');
const { admin, role, userRole } = require('shared/src/database/models');
const PROTECTED_ATTRIBUTES = ['password'];
const { hasSuperAdminRole } = require('shared/src/helpers');
const {
  getModulePermissions,
  getUserPermissions
} = require('backend-cms/src/helpers');
module.exports = {
  checkPermission(permission) {
    return function (req, res, next) {
      req.module = permission;
      if (req.session.user) {
        if (hasSuperAdminRole(req.session.user)) {
          return next();
        } else {
          if (
            req.session.userPermissions &&
            req.session.userPermissions !== null &&
            _.includes(req.session.userPermissions, permission)
          ) {
            return next();
          }
          req.flash(
            'error_msg',
            "You don't have permission to view this page."
          );
          return res.redirect('/home');
        }
      }
      return res.redirect('/home');
    };
  },
  sessionUserPermissions: async function (req, res, next) {
    let user;
    if (req.session.user && req.session.user.id) {
      if (
        req.session.user &&
        req.session.user.role_id &&
        req.session.user.role_id !== ''
      ) {
        user = await admin.findOne({
          where: { id: req.session.user.id },
          attributes: { exclude: PROTECTED_ATTRIBUTES },
          include: [
            {
              model: role,
              as: 'role',
              attributes: ['_id', 'name', 'slug', 'permission']
            }
          ]
        });
      } else {
        user = await admin.findOne({
          where: { id: req.session.user.id },
          attributes: { exclude: PROTECTED_ATTRIBUTES },
          include: [{ model: userRole, as: 'userRoles' }]
        });
      }

      if (!hasSuperAdminRole(req.session.user)) {
        if (user && user.status !== 'active') {
          await req.session.destroy();
          return res.redirect(`/login?state=inactive`);
        }
      }
    }

    let userPermissions = await getUserPermissions(user);

    req.session.user = user;
    req.session.userPermissions = userPermissions;
    res.locals.modulePermissions = getModulePermissions(user, userPermissions);
    res.locals.user = req.session?.user || null;
    if (res.locals.user !== null) {
      res.locals.user.userPermissions = req.session?.userPermissions || null;
    }
    next();
  }
};
