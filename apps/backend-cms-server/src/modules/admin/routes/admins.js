const express = require('express');
const router = express.Router();
const {
  container
} = require('shared/src/providers/container-service-provider');
const adminController = container.resolve('adminController');
const { checkPermission } = require('backend-cms/src/middlewares');
const { validate } = require('shared/src/middlewares');
const {
  addAdminValidation,
  changePasswordValidation
} = require('../validators');
const wrapNext = require('shared/src/middlewares/wrapNext');

router.get(
  '/',
  [checkPermission('user-management.admins.view')],
  wrapNext(adminController.index)
);
router.get(
  '/create',
  [checkPermission('user-management.admins.create')],
  wrapNext(adminController.addView)
);
router.post(
  '/',
  [
    checkPermission('user-management.admins.create'),
    addAdminValidation,
    validate
  ],
  wrapNext(adminController.add)
);
router.get(
  '/:id',
  [checkPermission('user-management.admins.view')],
  wrapNext(adminController.editView)
);
router.put(
  '/:id',
  [
    checkPermission('user-management.admins.edit'),
    addAdminValidation,
    validate
  ],
  wrapNext(adminController.edit)
);
router.delete(
  '/:id',
  checkPermission('user-management.admins.delete'),
  wrapNext(adminController.delete)
);
router.get(
  '/:id/change-password',
  [checkPermission('user-management.admins.password')],
  wrapNext(adminController.changePasswordView)
);
router.put(
  '/:id/change-password',
  [
    checkPermission('user-management.admins.password'),
    changePasswordValidation,
    validate
  ],
  wrapNext(adminController.changePassword)
);

module.exports = router;
