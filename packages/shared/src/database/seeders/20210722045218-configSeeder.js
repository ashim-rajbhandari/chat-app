'use strict';
const sequelize = require('sequelize');
const { config } = require('../models');

module.exports = {
  up: async (queryInterface) => {
    const checkConfig = async (name) =>
      config.count({
        where: {
          name: sequelize.where(
            sequelize.fn('lower', sequelize.col('name')),
            name
          )
        }
      });

    let insertArray = [];
    let configsArray = [
      {
        name: 'Past Password Usage Restrictions',
        value: 3,
        type: 'text',
        attribute: 'count',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Password Expiration',
        value: 90,
        type: 'text',
        attribute: 'days',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Minimum Password Length',
        value: 8,
        type: 'text',
        attribute: 'length',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Password Reset Url Validity',
        value: 24,
        type: 'text',
        attribute: 'hours',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'OTP Validity',
        value: 15,
        type: 'text',
        attribute: 'minutes',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    for (let item of configsArray) {
      let check = await checkConfig(item?.['name'].toLowerCase().trim());
      if (check === 0) {
        insertArray.push(item);
      }
    }

    if (insertArray.length > 0) {
      await queryInterface.bulkInsert('configs', insertArray);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('configs');
  }
};
