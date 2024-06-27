'use strict';
const { DataTypes, Sequelize } = require('sequelize');

const attributes = () => {
  return {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    _id: {
      allowNull: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'admins',
        key: 'id',
        onDelete: 'SET NULL'
      },
      allowNull: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'roles',
        onDelete: 'SET NULL',
        key: 'id'
      },
      allowNull: true
    },
    role_slug: { type: DataTypes.STRING, allowNull: true },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('now')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('now')
    }
  };
};
module.exports = {
  up: async (queryInterface) => {
    return queryInterface.createTable('user_roles', attributes());
  },
  down: async (queryInterface) => {
    return queryInterface.dropTable('user_roles');
  },
  attributes
};
