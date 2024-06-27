const { checkSchema } = require('express-validator');
const {
  maxLength,
  minLength,
  required,
  genericError
} = require('shared/src/helpers');
const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const passwordRules = {
  newPassword: {
    custom: {
      options: async (value) => {
        let minPasswordLen = 8;
        required('New Password', value);
        maxLength('New Password ', value, 25);
        minLength('New Password ', value, minPasswordLen);
        if (!regex.test(value)) {
          throw new Error(
            'Password must contain one UpperCase, One lowerCase, one number and one special character.'
          );
        }
        return true;
      }
    }
  },
  confirmPassword: {
    custom: {
      options: (value, { req }) => {
        required('Confirm Password', value);
        if (req.body.newPassword === value) {
          req.body.password = req.body.newPassword;
          return true;
        } else {
          genericError('Confirm Password and New Password do not match');
        }
      }
    }
  }
};
const passwordValidator = checkSchema(passwordRules);

module.exports = {
  passwordValidator,
  passwordRules
};
