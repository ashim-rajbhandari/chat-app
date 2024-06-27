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
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      ndex: true
    },
    client_secret: {
      type: DataTypes.STRING
    },
    grants: {
      type: DataTypes.STRING
    },
    redirect_uris: {
      type: DataTypes.STRING
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('now')
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('now')
    }
  };
};
module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable('clients', attributes());
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('clients');
  },
  attributes
};
