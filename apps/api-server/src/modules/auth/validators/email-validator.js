const { checkSchema } = require('express-validator');
const { required } = require('shared/src/helpers');
const { frontendUser } = require('shared/src/database/models');
const sequelize = require('sequelize');
let userData;

let emailValidator = checkSchema({
  email: {
    isEmail: {
      errorMessage: 'Not a valid Email'
    },
    custom: {
      options: async function (value) {
        required('Email ', value);
        userData = await frontendUser.findOne({
          where: {
            email: sequelize.where(
              sequelize.fn('lower', sequelize.col('email')),
              sequelize.fn('lower', value)
            )
          }
        });
        if (userData == null) {
          throw new Error('Invalid Email.');
        }
        return true;
      }
    }
  }
});

module.exports = { emailValidator };
