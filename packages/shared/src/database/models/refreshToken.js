'use strict';
const {
  attributes
} = require('../migrations/20230206054014-create_refreshToken_table');
module.exports = (sequelize) => {
  const modelDefinition = {
    ...attributes()
  };
  let modelOptions = {
    tableName: 'refresh_token',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  };

  const refreshToken = sequelize.define(
    'refreshToken',
    modelDefinition,
    modelOptions
  );
  refreshToken.associate = (models) => {
    refreshToken.belongsTo(models.frontendUser, {
      foreignKey: 'fe_user_id',
      as: 'feUserData'
    });
  };
  return refreshToken;
};
