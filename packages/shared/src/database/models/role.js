'use strict';
const sequelizePaginate = require('sequelize-paginate');
const {
  attributes
} = require('../migrations/20210707141144-create_roles_table');
module.exports = (sequelize) => {
  let modelDefinition = {
    ...attributes()
  };
  let modelOptions = {
    tableName: 'roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  };
  const roleModel = sequelize.define('role', modelDefinition, modelOptions);
  sequelizePaginate.paginate(roleModel);
  roleModel.associate = (models) => {
    roleModel.hasMany(models.userRole, {
      foreignKey: 'role_id',
      as: 'roleUsers'
    });
  };
  return roleModel;
};
