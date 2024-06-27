'use strict';
const { loginInfo, admin } = require('shared/src/database/models');
const moment = require('moment');
const { getipAddress, getConfigData } = require('shared/src/helpers');

let authService = {};

authService.globalizeSelectedLang = async (req, user) => {
  req.session.selectedLanguage = user.selected_language ?? 'ja';
  req.session.languageSlug = user.selected_language ?? 'ja';
};

authService.clearResetPasswordData = async (req) => {
  if (
    req.session.user.reset_password_token ||
    req.session.user.reset_password_expires
  ) {
    await admin.update(
      { reset_password_token: null, reset_password_expires: null },
      { where: { _id: req.session.user._id }, individualHooks: true }
    );
    req.session.user.reset_password_token = null;
    req.session.user.reset_password_expires = null;
  }
};

authService.remainingLockTime = (req) => {
  let remainingLockTime = 0;
  if (req.session.lockoutTime) {
    const current = moment();
    const lockTime = moment(req.session.lockoutTime);
    remainingLockTime = lockTime.diff(current, 'minutes');
  }
  return remainingLockTime;
};

authService.resetLockTime = (req) => {
  if (req.session.lockoutTime) {
    const current = moment();
    const lockTime = moment(req.session.lockoutTime);
    const remainingTime = lockTime.diff(current, 'minutes');
    if (remainingTime === 0) {
      req.session.loginCount = null;
      req.session.lockoutTime = null;
    }
  }
};

authService.handleLockoutTimeAndCount = (req) => {
  if (!req.session.loginCount) {
    req.session.loginCount = 1;
  } else {
    req.session.loginCount += 1;
  }
  let lockoutCount = 3;
  let lockoutTime = 2;

  if (
    getConfigData(req, 'Lockout Count') &&
    getConfigData(req, 'Lockout Count') !== ''
  ) {
    lockoutCount = getConfigData(req, 'Lockout Count');
  }
  if (
    getConfigData(req, 'Valid Lockout Time') &&
    getConfigData(req, 'Valid Lockout Time') !== ''
  ) {
    lockoutTime = getConfigData(req, 'Valid Lockout Time');
  }
  if (
    req.session.loginCount &&
    req.session.loginCount === parseInt(lockoutCount)
  ) {
    req.session.lockoutTime = moment().add(
      parseInt(lockoutTime) + 1,
      'minutes'
    );
  }
};

authService.storeLoginLogs = async (req) => {
  return loginInfo.create({
    user_id: req.session.user.id,
    login_ip_address: getipAddress(req),
    login_date_time: moment().tz('Asia/Kathmandu').format('YYYY-MM-DD HH:mm:ss')
  });
};

authService.storeLogoutLogs = (req) => {
  if (req.session.user) {
    loginInfo
      .findOne({
        where: { user_id: req.session.user.id },
        order: [['login_date_time', 'DESC']]
      })
      .then(function (record) {
        if (record !== null) {
          record.update({
            logout_date_time: moment()
              .tz('Asia/Kathmandu')
              .format('YYYY-MM-DD HH:mm:ss')
          });
        }
      });
    return true;
  }
};

authService.refresh2FA = async (req) => {
  const check = await authService.otpVerification(req);
  if (check) {
    await admin.update(
      { otp_code: null },
      { where: { _id: req.session.user._id }, individualHooks: true }
    );
    req.session.user.otp_code = null;
  }
  return check;
};

module.exports = authService;
