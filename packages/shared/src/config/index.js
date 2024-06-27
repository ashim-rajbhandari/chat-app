const config = require('config');
const ports = config.get('ports');
const tokens = config.get('tokens');

module.exports = {
  apiPort: ports.API_PORT || 3333,
  cmsPort: ports.CMS_PORT || 7070,
  pageLimit: config.PAGE_LIMIT || 20,
  token: {
    accessTokenExpiry: tokens.accessTokenExpiry || 120,
    refreshTokenExpiry: tokens.refreshTokenExpiry || 7200,
    accessTokenSecret: tokens.accessTokenSecret || 'accesstokensecret',
    refreshTokenSecret: tokens.refreshTokenSecret || 'refreshtokensecret'
  }
};
