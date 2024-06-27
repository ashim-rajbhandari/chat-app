'use strict';
const { Sequelize, DataTypes } = require('sequelize');

const attributes = () => {
  return {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    _id: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: { type: DataTypes.STRING, required: true },
    slug: { type: DataTypes.STRING, required: true },
    permission: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false
    },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.fn('now') },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.fn('now') }
  };
};
module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable('roles', attributes());
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('roles');
  },
  attributes
};
