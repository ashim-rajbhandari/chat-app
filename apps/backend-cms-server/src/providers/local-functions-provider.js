const _ = require('lodash');
const moment = require('moment');
const { cmsTitle, cmsUrl } = require('../config');
const { formatDate, formatDateToNepali } = require('shared/src/helpers');
const { hasSuperAdminRole } = require('shared/src/helpers');

module.exports = class LocalFunctionProvider {
  static register(app) {
    app.locals._ = _;
    app.locals.cmsTitle = cmsTitle;
    app.locals.baseUrl = cmsUrl;

    app.locals.getDuration = (date) => {
      let newDate = date.split('/');
      let m1 = moment().format('YYYY-MM');
      let m2 = moment(newDate[1] + '-' + newDate[0]).format('YYYY-MM');
      return moment.preciseDiff(m1, m2);
    };

    app.locals.getTodaysDate = () => {
      return encodeURIComponent(
        moment().startOf('day').format('MM/DD/YYYY') +
          ' - ' +
          moment().endOf('day').format('MM/DD/YYYY')
      );
    };

    app.locals.formatDate = (date, format) => {
      try {
        return formatDate(date, format);
      } catch (error) {
        console.log(error);
      }
    };

    app.locals.formatDateToNepali = (date, format) => {
      try {
        return formatDateToNepali(date, format);
      } catch (error) {
        console.log(error);
      }
    };

    app.locals.getCmsConfig = (configData, configName) => {
      let obj = configData.find((o) => o.name === configName);
      return obj.value;
    };

    app.locals.getRemainingAttempts = (configData, configName, count) => {
      let obj = configData.find((o) => o.name === configName);
      return obj.value - count;
    };

    app.locals.checkPermissions = (user, permission) => {
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
    };

    app.locals.currentDate = () => {
      try {
        return formatDate(new Date(), 'YYYY-MM-DD');
      } catch (error) {
        console.log(error);
      }
    };

    app.locals.getSn = (perPage, currentPage, key) => {
      return perPage * (currentPage - 1) + (key + 1);
    };

    app.locals.getUserIds = (data) => {
      let userIds = [];
      data.map((user) => {
        userIds.push(user.user_id);
      });
      return userIds;
    };

    app.locals.getConfiguration = (configData, configName, deflt = null) => {
      let obj = configData.find((o) => o.name === configName);
      if (obj) {
        return obj.value;
      }
      return deflt;
    };

    app.locals.pad = (num, places = 8) => {
      return String(num).padStart(places, '0');
    };

    app.locals.pageAndPerPage = (query) => {
      let page = 1;
      let perPage = 10;
      if (query.page !== undefined) {
        page = query.page;
      }
      if (query.perPage !== undefined) {
        perPage = query.perPage;
      }
      return `page=${page}&perPage=${perPage}`;
    };

    app.locals.cmsTitleSeperator = '-';
  }
};
