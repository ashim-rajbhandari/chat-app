'use strict';
const sequelizePaginate = require('sequelize-paginate');
const {
  attributes
} = require('../migrations/20210804081419-create_config_table');

module.exports = (sequelize) => {
  const modelDefinition = {
    ...attributes()
  };
  const modelOptions = {
    tableName: 'configs',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  };

  const config = sequelize.define('config', modelDefinition, modelOptions);
  sequelizePaginate.paginate(config);
  return config;
};
