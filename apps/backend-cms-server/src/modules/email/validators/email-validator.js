const { checkSchema } = require('express-validator');
const { emailTemplate } = require('shared/src/database/models');
const { Op } = require('sequelize');
const { checkMaxLength, required } = require('shared/src/helpers');

let EmailValidation = checkSchema({
  title: {
    custom: {
      options: function (value, { req }) {
        required('Title', value);
        if (typeof req.body.title !== 'undefined') {
          return checkMaxLength('Title', req.body.title, 50);
        } else {
          return true;
        }
      }
    }
  },
  code: {
    custom: {
      options: function (value, { req }) {
        required('Code', value);

        if (value) {
          checkMaxLength('Code', value, 50);
          let isEdit = req.params && req.params.id ? true : false;
          return new Promise((resolve, reject) => {
            let whereCondition = {
              where: {
                code: value
              }
            };
            if (isEdit) {
              whereCondition = {
                where: {
                  code: value,
                  _id: {
                    [Op.ne]: req.params.id
                  }
                }
              };
            }
            emailTemplate.findOne(whereCondition).then((data) => {
              if (data === null) {
                resolve(true);
              } else {
                reject('Code value must be unique!');
              }
            });
          });
        } else {
          return true;
        }
      }
    }
  },
  subject: {
    custom: {
      options: function (value) {
        required('Subject', value);
        return checkMaxLength('Subject', value, 50);
      }
    }
  },

  body: {
    custom: {
      options: function (value) {
        required('Body', value);
        checkMaxLength('Body', value, 2000, true);
        return true;
      }
    }
  }
});

module.exports = { EmailValidation };
