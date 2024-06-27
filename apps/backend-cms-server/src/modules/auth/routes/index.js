const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  container
} = require('shared/src/providers/container-service-provider');
const authService = require('../services/auth-service');
const authController = container.resolve('authController');
const { validate } = require('shared/src/middlewares');
const { authenticateUser } = require('backend-cms/src/middlewares');

const {
  resetPasswordValidator,
  forgotPasswordValidator,
  otpValidator
} = require('../validators');
const { createActivityLog } = require('backend-cms/src/helpers');
const LogMessage = require('backend-cms/src/constants');

router.get('/', [authenticateUser.guest], authController.login);
router.get('/login', [authenticateUser.guest], authController.login);

router.post('/login', async (req, res, next) => {
  await passport.authenticate('local', async (err, user, info) => {
    if (user) {
      await Promise.all([
        authService.storeLoginLogs(req),
        authService.clearResetPasswordData(req)
      ]);
      createActivityLog(user?.id, LogMessage.LOGIN);
      return res.redirect('/home');
    } else {
      let msg =
        info && info.message ? info.message : 'Incorrect Email/Password';
      req.flash('error_msg', msg);
      return res.redirect('/login');
    }
  })(req, res, next);
});
router.get('/otp-verification', authController.optVerificationView);
router.post(
  '/otp-verification',
  [otpValidator, validate],
  authController.optVerification
);
router.get('/resend-otp', authController.resendOtp);
router.get('/forgot-password', authController.forgotPasswordView);
router.post(
  '/forgot-password',
  [forgotPasswordValidator, validate],
  authController.forgotPassword
);
router.get('/force/reset-password', authController.forceResetPasswordView);
router.get('/reset-password/:token', authController.resetPasswordView);
router.post(
  '/reset-password/:token',
  [resetPasswordValidator, validate],
  authController.resetPassword
);

router.get('/logout', [authenticateUser.isLoggedIn], authController.logout);
module.exports = router;
