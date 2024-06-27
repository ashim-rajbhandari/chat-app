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
    _id: {
      allowNull: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()')
    },
    name: { type: Sequelize.STRING, allowNull: false },
    slug: { type: Sequelize.STRING, allowNull: false },
    module: { type: Sequelize.STRING, allowNull: false },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') }
  };
};

module.exports = {
  up: async (queryInterface) => {
    return Promise.all([
      await queryInterface.sequelize.query(
        'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
        { returning: true }
      ),
      queryInterface.createTable('permissions', attributes())
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('permissions');
  },
  attributes
};
