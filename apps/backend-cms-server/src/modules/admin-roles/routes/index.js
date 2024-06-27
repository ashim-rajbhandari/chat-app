const express = require('express');
const router = express.Router();
const {
  container
} = require('shared/src/providers/container-service-provider');
const roleController = container.resolve('roleController');
const { checkPermission } = require('backend-cms/src/middlewares');
const { validate } = require('shared/src/middlewares');
const { roleValidation } = require('../validators');
const wrapNext = require('shared/src/middlewares/wrapNext');

router.get(
  '/',
  [checkPermission('user-management.admin-roles.view')],
  wrapNext(roleController.index)
);
router.get(
  '/create',
  [checkPermission('user-management.admin-roles.create')],
  wrapNext(roleController.addView)
);
router.post(
  '/',
  [
    checkPermission('user-management.admin-roles.create'),
    roleValidation,
    validate
  ],
  wrapNext(roleController.add)
);
router.get(
  '/:id',
  [checkPermission('user-management.admin-roles.view')],
  wrapNext(roleController.editView)
);
router.put(
  '/:id',
  [
    checkPermission('user-management.admin-roles.edit'),
    roleValidation,
    validate
  ],
  wrapNext(roleController.edit)
);
router.delete(
  '/:id',
  [checkPermission('user-management.admin-roles.delete')],
  wrapNext(roleController.delete)
);
router.post(
  '/:id/add-users',
  [checkPermission('user-management.admin-roles.add-users')],
  wrapNext(roleController.addUsers)
);
module.exports = router;
