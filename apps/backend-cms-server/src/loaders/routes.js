const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  sessionUserPermissions
} = require('backend-cms/src/middlewares');
const adminRoles = require('../modules/admin-roles/routes');
const admins = require('../modules/admin/routes/admins');
const updateProfile = require('../modules/admin/routes/update-profile');
const email = require('../modules/email/routes');
const config = require('../modules/config/routes');
const activityLogs = require('../modules/logs/routes/admin-logs');
const chats = require('../modules/chat/routes/chats');

router.use(require('../modules/auth/routes'));
router.use(require('../modules/dashboard/routes'));

router.use(
  '/profile-update',
  [authenticateUser.isLoggedIn, sessionUserPermissions],
  updateProfile
);
router.use(
  '/admin-roles',
  [authenticateUser.isLoggedIn, sessionUserPermissions],
  adminRoles
);
router.use(
  '/admins',
  [authenticateUser.isLoggedIn, sessionUserPermissions],
  admins
);
router.use(
  '/email-templates',
  [authenticateUser.isLoggedIn, sessionUserPermissions],
  email
);
router.use(
  '/configs',
  [authenticateUser.isLoggedIn, sessionUserPermissions],
  config
);
router.use(
  '/admin-logs',
  [authenticateUser.isLoggedIn, sessionUserPermissions],
  activityLogs
);
router.use(
  '/chats',
  [authenticateUser.isLoggedIn, sessionUserPermissions],
  chats
);
module.exports = router;
