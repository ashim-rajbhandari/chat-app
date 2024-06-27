const { checkSchema } = require('express-validator');
const { required } = require('shared/src/helpers');

let otpValidator = checkSchema({
  otp_code: {
    custom: {
      options: async (value) => {
        required('Otp Code ', value);
        return true;
      }
    }
  }
});
module.exports = { otpValidator };
