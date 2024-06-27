const { checkSchema } = require('express-validator');
const { required } = require('shared/src/helpers');
const { frontendUser } = require('shared/src/database/models');

let resetPasswordValidator = checkSchema({
  token: {
    custom: {
      options: async function (value) {
        required('Token ', value);
        let currentDate = new Date();
        const userData = await frontendUser.findOne({
          where: {
            reset_password_token: value
          },
          attributes: ['reset_password_expires']
        });
        if (userData === null) {
          throw new Error('Invalid Token.');
        }
        if (userData.reset_password_expires < currentDate) {
          throw new Error('Your Token has expired.');
        }
        return true;
      }
    }
  }
});

module.exports = { resetPasswordValidator };
