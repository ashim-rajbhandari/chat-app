const express = require('express');
const router = express.Router();
const {
  container
} = require('shared/src/providers/container-service-provider');
const emailTemplateController = container.resolve('emailTemplateController');
const { checkPermission } = require('backend-cms/src/middlewares');
const { validate } = require('shared/src/middlewares');
const { EmailValidation } = require('../validators');
const wrapNext = require('shared/src/middlewares/wrapNext');

router.get(
  '/',
  [checkPermission('email-templates.email-templates.view')],
  wrapNext(emailTemplateController.index)
);
router.get(
  '/:id',
  [checkPermission('email-templates.email-templates.edit')],
  wrapNext(emailTemplateController.editView)
);
router.put(
  '/:id',
  [
    checkPermission('email-templates.email-templates.edit'),
    EmailValidation,
    validate
  ],
  wrapNext(emailTemplateController.edit)
);
router.delete(
  '/:id',
  checkPermission('email-templates.email-templates.view'),
  wrapNext(emailTemplateController.delete)
);

module.exports = router;
