const { checkSchema } = require('express-validator');
const { getConfigData } = require('shared/src/helpers');
const {
  required,
  genericError,
  between,
  alphaNumeric
} = require('shared/src/helpers');
const resetPasswordValidator = checkSchema({
  password: {
    custom: {
      options: (value, { req }) => {
        const attrName = 'Password';
        required(attrName, value);
        alphaNumeric(attrName, value);
        between(
          attrName,
          value,
          getConfigData(req, 'Minimum Password Length'),
          20
        );
        return true;
      }
    }
  },
  confirm_password: {
    custom: {
      options: (value, { req }) => {
        required('Confirm password', value);
        if (value === req.body.password) {
          return true;
        } else {
          genericError('Password do not match');
          throw new Error();
        }
      }
    }
  }
});

module.exports = { resetPasswordValidator };
