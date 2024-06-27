'use strict';
const _ = require('lodash');
const config = require('../config/cmsConfig');
const modules = config.modules;
const modulePages = config.modulePages;
const modulePermissions = config.modulePermissions;
const moduleIcons = config.moduleIcons;
const { hasSuperAdminRole } = require('shared/src/helpers');
const db = require('shared/src/config/database').postgres;
module.exports = {
  hasPermission: (user, permission) => {
    if (user !== null) {
      if (hasSuperAdminRole(user)) {
        return true;
      } else {
        if (
          user !== null &&
          user.role &&
          _.includes(user.role.permission, permission)
        ) {
          return true;
        } else if (
          user !== null &&
          user.userPermissions &&
          _.includes(user.userPermissions, permission)
        ) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  },
  getUserPermissions: async (user) => {
    let userPermission;
    if (user && user.role) {
      userPermission = user.role.permission;
    }

    if (user && user.userRoles && user.userRoles.length > 0) {
      let userRoles = await db.query(
        `select u.user_id, array_agg( array_to_json(  r."permission")) as permission 
                from user_roles u join roles r ON  u.role_id = r.id where u.user_id =:user_id
                group by u.user_id`,
        {
          replacements: { user_id: user.id },
          type: db.SELECT
        }
      );
      userPermission = [
        ...new Set([].concat.apply([], userRoles?.[0]?.[0]?.permission ?? []))
      ];
    }

    return userPermission;
  },
  getModulePermissions: (user, userPermissions) => {
    let permission = [];
    if (user && (user.role || user.userRoles)) {
      if (hasSuperAdminRole(user)) {
        for (let moduleID in modules) {
          const arrayData = {
            id: moduleID,
            title: modules[moduleID],
            subpagesCount: Object.keys(modulePages[moduleID]).length,
            enableDropdown:
              Object.keys(modulePages[moduleID]).length > 1 ? true : false,
            subPages: modulePages[moduleID],
            subPagesIcon: moduleIcons,
            icon: moduleIcons[moduleID]
          };
          permission.push(arrayData);
        }
      } else {
        for (let moduleID in modules) {
          if (moduleID === 'home') {
            const arrayData = {
              id: moduleID,
              title: modules[moduleID],
              subpagesCount: Object.keys(modulePages[moduleID]).length,
              enableDropdown:
                Object.keys(modulePages[moduleID]).length > 1 ? true : false,
              subPages: modulePages[moduleID],
              subPagesIcon: moduleIcons,
              icon: moduleIcons[moduleID]
            };
            permission.push(arrayData);
          } else {
            if (modulePermissions[moduleID] !== undefined) {
              let modulePermissionData = _.map(
                modulePermissions[moduleID],
                function (p, key) {
                  if (_.includes(userPermissions, key)) {
                    return key;
                  }
                }
              );
              modulePermissionData = _.filter(
                modulePermissionData,
                function (p) {
                  return p !== undefined;
                }
              );
              if (
                modulePermissionData.length > 0 &&
                modulePermissionData !== undefined
              ) {
                let submoduleArray = {};
                _.map(modulePages[moduleID], function (p, key) {
                  let submodulePermissionInsideData = _.filter(
                    modulePermissionData,
                    function (o) {
                      return o.indexOf(key) >= 0;
                    }
                  );
                  if (submodulePermissionInsideData.length > 0) {
                    if (
                      _.includes(
                        userPermissions,
                        moduleID + '.' + key + '.' + 'view'
                      )
                    ) {
                      submoduleArray[key] = p;
                    }
                  }
                });
                const arrayData = {
                  id: moduleID,
                  title: modules[moduleID],
                  subpagesCount: Object.keys(modulePages[moduleID]).length,
                  enableDropdown:
                    Object.keys(modulePages[moduleID]).length > 1
                      ? true
                      : false,
                  subPages: submoduleArray,
                  subPagesIcon: moduleIcons,
                  icon: moduleIcons[moduleID]
                };
                permission.push(arrayData);
              }
            }
          }
        }
      }
    }
    return permission;
  }
};
