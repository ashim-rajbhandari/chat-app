const moment = require('moment');
const { getConfigData, hasSuperAdminRole } = require('../helpers');
const authService = require('../modules/auth/services/auth-service');

let twoFA = async (req, res, next) => {
  if (!req.session.user.otp_code) {
    return next();
  } else {
    if (await authService.refresh2FA(req)) {
      return next();
    }
    return res.redirect('/otp-verification');
  }
};

let checkPasswordResetAndExpiration = async (req, res, next) => {
  if (hasSuperAdminRole(req.session.user)) {
    return next();
  } else {
    if (
      !req.session.user.password_resetted ||
      req.session.user.show_reset_password
    ) {
      return res.redirect('/force/reset-password');
    } else if (
      getConfigData(req, 'Password Expiration') &&
      getConfigData(req, 'Password Expiration') !== ''
    ) {
      const passwordResettedDate = req.session.user.password_resetted_date;
      const passwordExpirationDays = getConfigData(req, 'Password Expiration');
      const expirationDate = moment(passwordResettedDate, 'YYYY-MM-DD').add(
        passwordExpirationDays,
        'days'
      );
      if (moment() >= expirationDate) {
        return res.redirect('/force/reset-password');
      } else {
        return next();
      }
    } else {
      return next();
    }
  }
};
module.exports = {
  twoFA,
  checkPasswordResetAndExpiration
};
