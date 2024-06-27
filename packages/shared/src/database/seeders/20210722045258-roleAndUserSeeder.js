'use strict';
require('module-alias/register');
const {
  permission,
  role,
  admin,
  config
} = require('shared/src/database/models');
const { bcryptPassword } = require('shared/src/helpers');
const { MAINSUPERADMIN } = require('shared/src/constants');
const configuration = require('config');
const cmsConf = configuration.get('cms');

module.exports = {
  up: async () => {
    let permissions = await permission.findAll();
    let permissionsArray = [];
    permissions.forEach((data) => {
      permissionsArray.push(data.slug);
    });
    let roleData = {
      name: 'Super Admin',
      slug: 'superadmin',
      permission: permissionsArray
    };
    let roles = await role.findOne({ where: { slug: roleData.slug } });
    let hashRound = 10;
    let hashRoundData = await config.findOne({
      where: { name: 'Password Hashing Rounds' }
    }); //get Hashing rounds
    if (hashRoundData || hashRoundData !== null) {
      hashRound = parseInt(hashRoundData.value);
    }
    if (!roles) {
      roles = await role.create(roleData);
    }
    let adminData = {
      _id: MAINSUPERADMIN,
      first_name: 'Super Admin',
      last_name: 'Ekbana',
      email: cmsConf.ADMIN_DEFAULT_EMAIL || 'superadmin@mailinator.com',
      username: 'admin',
      password: bcryptPassword('123admin@', hashRound),
      contact_number: '9874243299',
      role_id: roles.id,
      image: '',
      status: 'active'
    };
    const superAdmindata = await admin.findOne({
      where: {
        _id: MAINSUPERADMIN
      }
    });

    if (superAdmindata === null) {
      await admin.create(adminData);
    }
  },

  down: async () => {
    return true;
  }
};
