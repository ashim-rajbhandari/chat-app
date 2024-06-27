module.exports = Object.assign(
  {},
  require('./login-validator'),
  require('./signup-validator'),
  require('./password-validator'),
  require('./email-validator'),
  require('./reset-password-validator')
);
