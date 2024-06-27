const express = require('express');
const router = express.Router();
const {
  container
} = require('shared/src/providers/container-service-provider');
const authController = container.resolve('apiAuthController');
const wrapNext = require('shared/src/middlewares/wrapNext');
const {
  validate,
  camelCaseParserMiddleware
} = require('shared/src/middlewares');
const {
  loginValidator,
  signUpValidator,
  passwordValidator,
  emailValidator,
  resetPasswordValidator
} = require('../validators');

router.post(
  '/signup',
  [signUpValidator, passwordValidator, validate, camelCaseParserMiddleware],
  authController.accountRegister
);
router.post('/verify/:token', wrapNext(authController.verifyToken));
router.post(
  '/login',
  [loginValidator, validate],
  wrapNext(authController.login)
);
router.post('/logout', authController.logout);
router.get('/refresh-token', wrapNext(authController.refreshToken));
router.post(
  '/forgot-password',
  [emailValidator, validate],
  wrapNext(authController.handleForgotPassword)
);
router.post(
  '/reset-password/',
  [resetPasswordValidator, passwordValidator, validate],
  wrapNext(authController.handleResetPassword)
);

module.exports = router;
