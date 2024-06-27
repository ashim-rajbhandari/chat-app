'use strict';
const { attributes } = require('../migrations/20210913080424-user_roles');
module.exports = (sequelize) => {
  let modelDefinition = {
    ...attributes()
  };
  let modelOptions = {
    tableName: 'user_roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  };
  const userRole = sequelize.define('userRole', modelDefinition, modelOptions);
  userRole.associate = (models) => {
    userRole.belongsTo(models.admin, {
      foreignKey: 'user_id',
      as: 'adminRole'
    });
    userRole.belongsTo(models.role, {
      foreignKey: 'role_id',
      as: 'roleAdmin'
    });
  };
  return userRole;
};
