const express = require('express');
const {
  container
} = require('shared/src/providers/container-service-provider');

const authController = container.resolve('apiAuthController');
const router = express.Router();
const auth = require('../modules/auth/routes');
const { routeNotFoundHandler } = require('shared/src/middlewares');
router.get('/', (_req, res) => {
  res.status(200).send({ msg: 'Hello from api-server' });
});
router.use('/auth', auth);
router.get('/remove-email/:email', authController.removeUserByEmail);
routeNotFoundHandler(router);
module.exports = router;
