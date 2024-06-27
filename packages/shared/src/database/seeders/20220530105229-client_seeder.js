'use strict';
require('module-alias/register');
const { clients } = require('shared/src/database/models');
module.exports = {
  up: async () => {
    let clientData = {
      name: 'Rest Api Client',
      grants: 'password'
    };
    const checkClientExists = await clients.count({
      where: {
        name: clientData['name']
      }
    });
    if (checkClientExists === 0) {
      const client = await clients.create(clientData);
      console.log(`Client ID: ${client.id}`);
      console.log(`Client Secret: ${client.client_secret}`);
    }
  },

  down: async () => {
    await clients.destroy({ truncate: true, restartIdentity: true });
    return Promise.resolve();
  }
};
