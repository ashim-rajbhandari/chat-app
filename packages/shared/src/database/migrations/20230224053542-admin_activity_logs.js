'use strict';
const { DataTypes, Sequelize } = require('sequelize');
const attributes = () => {
  return {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    message: { type: DataTypes.STRING, allowNull: true },
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
  up: (queryInterface) => {
    return queryInterface.createTable('admin_activity_logs', attributes());
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('admin_activity_logs');
  },
  attributes
};
