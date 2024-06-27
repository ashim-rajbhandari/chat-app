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
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    attribute: {
      type: DataTypes.STRING,
      allowNull: true
    },
    help_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
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
    return queryInterface.createTable('configs', attributes());
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('configs');
  },
  attributes
};
