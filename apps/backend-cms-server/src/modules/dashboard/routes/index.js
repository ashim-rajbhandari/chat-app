const express = require('express');
const router = express.Router();
const {
  container
} = require('shared/src/providers/container-service-provider');
const dashboardController = container.resolve('dashboardController');
const {
  authenticateUser,
  sessionUserPermissions
} = require('backend-cms/src/middlewares');
const wrapNext = require('shared/src/middlewares/wrapNext');

router.get(
  '/home',
  [authenticateUser.isLoggedIn, sessionUserPermissions],
  wrapNext(dashboardController.index)
);
module.exports = router;
