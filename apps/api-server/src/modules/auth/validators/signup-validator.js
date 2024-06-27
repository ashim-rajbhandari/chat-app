const { checkSchema } = require('express-validator');
const sequelize = require('sequelize');
const { frontendUser } = require('shared/src/database/models');
const {
  required,
  checkMaxLength,
  validNepaliPhoneNumber
} = require('shared/src/helpers');

const signUpValidator = checkSchema({
  fullName: {
    custom: {
      options: function (value) {
        required('Name', value);
        checkMaxLength('First Name', value, 50);
        return true;
      }
    }
  },
  phoneNum: {
    custom: {
      options: async function (value) {
        required('Phone Number', value);
        validNepaliPhoneNumber(value);
        const user = await frontendUser.findOne({
          where: { phone_num: value }
        });
        if (user) {
          throw new Error(
            'There is already an account registered with this phone number.'
          );
        }
        return true;
      }
    }
  },
  email: {
    isEmail: {
      errorMessage: 'Not a valid email'
    },
    custom: {
      options: async function (value) {
        required('Email', value);
        const user = await frontendUser.findOne({
          where: {
            email: sequelize.where(
              sequelize.fn('lower', sequelize.col('email')),
              sequelize.fn('lower', value)
            )
          }
        });
        if (user) {
          throw new Error(
            'There is already an account registered with this email.'
          );
        }
        return true;
      }
    }
  }
});

module.exports = {
  signUpValidator
};
