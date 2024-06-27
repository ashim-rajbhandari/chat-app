const express = require('express');
const router = express.Router();
const {
  container
} = require('shared/src/providers/container-service-provider');
const configController = container.resolve('configController');
const { checkPermission } = require('backend-cms/src/middlewares');
const wrapNext = require('shared/src/middlewares/wrapNext');

router.get(
  '/',
  [checkPermission('configs.cms-configs.view')],
  wrapNext(configController.index)
);
router.post(
  '/',
  [checkPermission('configs.cms-configs.create')],
  wrapNext(configController.add)
);
router.put(
  '/:id',
  [checkPermission('configs.cms-configs.edit')],
  wrapNext(configController.edit)
);
router.delete(
  '/:id',
  checkPermission('configs.cms-configs.delete'),
  wrapNext(configController.delete)
);

module.exports = router;
