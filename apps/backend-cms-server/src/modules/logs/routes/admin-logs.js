const express = require('express');
const router = express.Router();
const {
  container
} = require('shared/src/providers/container-service-provider');
const adminLogsController = container.resolve('adminLogsController');
const { checkPermission } = require('backend-cms/src/middlewares');
const wrapNext = require('shared/src/middlewares/wrapNext');

router.get(
  '/',
  checkPermission('logs.admin-logs.view'),
  wrapNext(adminLogsController.index)
);

module.exports = router;
