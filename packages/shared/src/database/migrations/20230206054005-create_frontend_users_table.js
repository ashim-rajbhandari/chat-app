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
    email: { type: DataTypes.STRING, unique: true, index: true },
    phone_num: { type: DataTypes.STRING, allowNull: true },
    full_name: { type: DataTypes.STRING, defaultValue: '' },
    address: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    reset_password_token: { type: DataTypes.STRING, allowNull: true },
    reset_password_expires: { type: DataTypes.DATE, allowNull: true },
    token: { type: DataTypes.STRING, allowNull: true },
    is_verified: { type: DataTypes.BOOLEAN, allowNull: true },
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
  async up(queryInterface) {
    return queryInterface.createTable('frontend_users', attributes());
  },

  async down(queryInterface) {
    return queryInterface.dropTable('merchants');
  },
  attributes
};
