'use strict';
const sequelizePaginate = require('sequelize-paginate');
const {
  attributes
} = require('../migrations/20210716134650-create_email_template_table');
module.exports = (sequelize) => {
  const modelDefinition = {
    ...attributes()
  };
  const modelOptions = {
    tableName: 'email_template',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  };
  const emailTemplate = sequelize.define(
    'emailTemplate',
    modelDefinition,
    modelOptions
  );
  sequelizePaginate.paginate(emailTemplate);
  return emailTemplate;
};
