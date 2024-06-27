const express = require('express');
const router = express.Router();
const {
  container
} = require('shared/src/providers/container-service-provider');
const merchantLogsController = container.resolve('merchantLogsController');
const { checkPermission } = require('backend-cms/src/middlewares');
const wrapNext = require('shared/src/middlewares/wrapNext');

router.get(
  '/',
  checkPermission('logs.merchant-logs.view'),
  wrapNext(merchantLogsController.index)
);

module.exports = router;
