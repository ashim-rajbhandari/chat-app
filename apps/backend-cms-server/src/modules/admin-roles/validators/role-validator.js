const { checkSchema } = require('express-validator');

const { role } = require('shared/src/database/models');
const sequelize = require('sequelize');
const { Op } = sequelize;
const {
  checkMaxLength,
  required,
  genericError
} = require('shared/src/helpers');

let roleValidation = checkSchema({
  name: {
    custom: {
      options: (value) => {
        required('Name', value);
        return checkMaxLength('Name', value, 50);
      }
    }
  },
  slug: {
    custom: {
      options: (value, { req }) => {
        required('Slug', value);
        let isEdit = req.params && req.params.id ? true : false;
        return new Promise((resolve, reject) => {
          let whereCondition = {
            where: {
              slug: sequelize.where(
                sequelize.fn('lower', sequelize.col('slug')),
                sequelize.fn('lower', value)
              )
            }
          };
          if (isEdit) {
            whereCondition = {
              where: {
                slug: sequelize.where(
                  sequelize.fn('lower', sequelize.col('slug')),
                  sequelize.fn('lower', value)
                ),
                _id: {
                  [Op.ne]: req.params.id
                }
              }
            };
          }

          role.findOne(whereCondition).then((item) => {
            if (item === null) {
              resolve(true);
            } else {
              reject('Role name must be unique');
            }
          });
        });
      }
    }
  },
  permission: {
    custom: {
      options: (value) => {
        if (value === undefined) {
          genericError('Select at least one permission');
        }
        return true;
      }
    }
  }
});

module.exports = { roleValidation };
