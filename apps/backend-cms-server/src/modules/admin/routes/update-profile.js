const express = require('express');
const router = express.Router();
const {
  container
} = require('shared/src/providers/container-service-provider');
const editAdminProfileController = container.resolve(
  'editAdminProfileController'
);
const { editAdminValidation } = require('../validators');

const { checkPermission } = require('backend-cms/src/middlewares');
const { validate } = require('shared/src/middlewares');
const wrapNext = require('shared/src/middlewares/wrapNext');
router.get(
  '/:id',
  [checkPermission('user-management.admin.update-profile')],
  wrapNext(editAdminProfileController.editView)
);
router.put(
  '/:id',
  [
    checkPermission('user-management.admin.update-profile'),
    editAdminValidation,
    validate
  ],
  wrapNext(editAdminProfileController.edit)
);

module.exports = router;
