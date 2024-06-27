'use strict';
const sequelizePaginate = require('sequelize-paginate');
const {
  attributes
} = require('../migrations/20230224053542-admin_activity_logs');

module.exports = (sequelize) => {
  const modelDefinition = {
    ...attributes()
  };
  const modelOptions = {
    tableName: 'admin_activity_logs',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  };
  const adminLogs = sequelize.define(
    'adminLogs',
    modelDefinition,
    modelOptions
  );
  adminLogs.associate = (models) => {
    adminLogs.belongsTo(models.admin, {
      foreignKey: 'user_id',
      targetKey: 'id',
      as: 'adminData'
    });
  };
  sequelizePaginate.paginate(adminLogs);
  return adminLogs;
};
