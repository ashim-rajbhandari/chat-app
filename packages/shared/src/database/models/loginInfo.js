'use strict';
const sequelizePaginate = require('sequelize-paginate');
const {
  attributes
} = require('../migrations/20210928034125-create_login_info_table');

module.exports = (sequelize) => {
  const modelDefinition = {
    ...attributes()
  };
  const modelOptions = {
    tableName: 'login_infos',
    timestamps: false
  };
  const loginInfo = sequelize.define(
    'loginInfo',
    modelDefinition,
    modelOptions
  );
  loginInfo.associate = (models) => {
    loginInfo.belongsTo(models.admin, {
      foreignKey: 'user_id',
      as: 'admins'
    });
  };
  sequelizePaginate.paginate(loginInfo);
  return loginInfo;
};
