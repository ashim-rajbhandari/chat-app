const { checkSchema } = require('express-validator');
const { required } = require('shared/src/helpers');
const forgotPasswordValidator = checkSchema({
  email: {
    isEmail: {
      errorMessage: 'Not a valid email'
    },
    custom: {
      options: (value) => {
        required('Email', value);
        return true;
      }
    }
  }
});
module.exports = { forgotPasswordValidator };
