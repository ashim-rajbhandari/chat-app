'use strict';
const { Sequelize } = require('sequelize');

const attributes = () => {
  return {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    refresh_token: {
      type: Sequelize.STRING
    },
    fe_user_id: {
      type: Sequelize.INTEGER,
      onDelete: 'cascade',
      references: {
        model: {
          tableName: 'frontend_users'
        },
        key: 'id'
      }
    },
    expires_at: {
      type: Sequelize.BIGINT
    },
    is_revoked: {
      defaultValue: false,
      type: Sequelize.BOOLEAN
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE
    }
  };
};
module.exports = {
  up: (queryInterface) => {
    return queryInterface
      .createTable('refresh_token', attributes())
      .then(() => {
        queryInterface.addIndex('refresh_token', ['fe_user_id']);
      });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('refresh_token');
  },
  attributes
};
