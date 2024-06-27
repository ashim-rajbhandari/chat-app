'use strict';
const {
  attributes
} = require('../migrations/20210707134555-create_permission_table');
module.exports = (sequelize) => {
  let modelDefinition = {
    ...attributes()
  };
  let modelOptions = {
    tableName: 'permissions',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  };

  return sequelize.define('permission', modelDefinition, modelOptions);
};
