'use strict';
const sequelizePaginate = require('sequelize-paginate');
const {
  attributes
} = require('../migrations/20230206054005-create_frontend_users_table');
module.exports = (sequelize) => {
  const modelDefinition = {
    ...attributes()
  };
  let modelOptions = {
    tableName: 'frontend_users',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  };
  const frontendUser = sequelize.define(
    'frontendUser',
    modelDefinition,
    modelOptions
  );
  sequelizePaginate.paginate(frontendUser);
  return frontendUser;
};
