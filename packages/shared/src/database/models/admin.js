'use strict';
const sequelizePaginate = require('sequelize-paginate');
const bcrypt = require('bcryptjs');
const {
  attributes
} = require('../migrations/20210707142322-create_admins_table');

module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    ...attributes(),
    display_name: {
      type: DataTypes.VIRTUAL,
      get() {
        const spaces = this.get('first_name') != null ? ' ' : '';
        return `${this.get('first_name') ?? ''}${spaces}${this.get(
          'last_name'
        )}`;
      }
    }
  };
  const modelOptions = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  };
  const adminModel = sequelize.define('admin', modelDefinition, modelOptions);

  adminModel.validPassword = function (passwordToMatch, password) {
    return bcrypt.compareSync(passwordToMatch, password);
  };

  adminModel.associate = (models) => {
    adminModel.belongsTo(models.role, {
      foreignKey: 'role_id',
      as: 'role'
    });
    adminModel.hasMany(models.userRole, {
      foreignKey: 'user_id',
      as: 'userRoles'
    });
  };
  sequelizePaginate.paginate(adminModel);
  return adminModel;
};
