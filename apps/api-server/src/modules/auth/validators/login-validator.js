const { checkSchema } = require('express-validator');
const bcrypt = require('bcryptjs');
const { required } = require('shared/src/helpers');
const { frontendUser } = require('shared/src/database/models');
const sequelize = require('sequelize');
let userData;

let loginValidator = checkSchema({
  username: {
    isEmail: {
      errorMessage: 'Not a valid email'
    },
    custom: {
      options: async function (value) {
        required('User name ', value);
        userData = await frontendUser.findOne({
          where: {
            email: sequelize.where(
              sequelize.fn('lower', sequelize.col('email')),
              sequelize.fn('lower', value)
            )
          },
          attributes: ['password']
        });
        if (userData === null) {
          throw new Error("Login credentials didn't match.");
        }
        return true;
      }
    }
  },
  password: {
    custom: {
      options: function (value) {
        required('Password', value);
        if (typeof value === 'undefined') {
          throw new Error('Password is required.');
        }
        if (
          userData !== null &&
          !bcrypt.compareSync(value, userData.password)
        ) {
          throw new Error("Login credentials didn't match.");
        }
        return true;
      }
    }
  }
});

module.exports = { loginValidator };
