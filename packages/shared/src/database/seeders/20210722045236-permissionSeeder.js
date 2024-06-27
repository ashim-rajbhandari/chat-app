'use strict';
require('module-alias/register');
const { permission } = require('shared/src/database/models');
const permissions =
  require('backend-cms/src/config/cmsConfig').modulePermissions;
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(
      'TRUNCATE permissions RESTART IDENTITY'
    );

    for (let key in permissions) {
      if (Object.prototype.hasOwnProperty.call(permissions, key)) {
        let permissionmodules = permissions[key];
        for (let moduleKey in permissionmodules) {
          if (
            Object.prototype.hasOwnProperty.call(permissionmodules, moduleKey)
          ) {
            const permissionData = {
              slug: moduleKey,
              name: permissionmodules[moduleKey],
              module: key
            };
            let existingPermission = await permission.findOne({
              where: { slug: permissionData.slug }
            });
            if (existingPermission === null) {
              const newPermission = new permission(permissionData);
              await newPermission.save();
            }
          }
        }
      }
    }
  },
  down: async () => {
    await permission.destroy({ truncate: true, restartIdentity: true });
    return Promise.resolve();
  }
};
