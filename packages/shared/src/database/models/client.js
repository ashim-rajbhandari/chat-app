'use strict';
const { generateRandomString } = require('../../helpers/commonHelper');
const { attributes } = require('../migrations/20220530043552-clients');

module.exports = (sequelize) => {
  const modelDefinition = {
    ...attributes()
  };
  const modelOptions = {
    tableName: 'clients',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: hashClientNsecret,
      beforeUpdate: hashClientNsecret
    }
  };

  return sequelize.define('clients', modelDefinition, modelOptions);
};

async function hashClientNsecret(Client) {
  Client.client_secret = generateRandomString(36);
}
