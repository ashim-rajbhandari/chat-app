const configuration = require('config');
const cmsConf = configuration.get('cms');

let config = {
  cmsTitle: cmsConf.CMS_TITLE || 'PAYMENT MANAGEMENT',
  cmsUrl: cmsConf.CMS_URL || 'http://localhost:8080/',
  pageLimit: cmsConf.PAGE_LIMIT || 20,
  cookieMaxAge: cmsConf.COOKIE_MAXAGE_IN_SEC || 43200
};

module.exports = config;
