const events = require('events');
const eventEmitter = new events.EventEmitter();
const {
  sendOtp,
  sendResetLink,
  createUser,
  notifyPasswordChanged
} = require('backend-cms/src/events');

eventEmitter.on('cms_otp_verification', sendOtp);
eventEmitter.on('forgot_password', sendResetLink);
eventEmitter.on('create-user', createUser);
eventEmitter.on('notify_password_changed', notifyPasswordChanged);

module.exports = {
  emitter: eventEmitter
};
