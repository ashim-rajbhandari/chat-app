const express = require('express');
const router = express.Router();
const {
  container
} = require('shared/src/providers/container-service-provider');
const chatController = container.resolve('chatController');
const { checkPermission } = require('backend-cms/src/middlewares');

const wrapNext = require('shared/src/middlewares/wrapNext');

router.get(
  '/',
  [checkPermission('chats.view')],
  wrapNext(chatController.index)
);
router.get(
  '/create',
  [checkPermission('chats.create')],
  wrapNext(chatController.addView)
);
router.post(
  '/',
  [
    checkPermission('chats.create'),
  ],
  wrapNext(chatController.add)
);
router.get(
  '/:id',
  [checkPermission('chats.view')],
  wrapNext(chatController.editView)
);



module.exports = router;
