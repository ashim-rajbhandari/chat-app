'use strict';
require('module-alias/register');
const config = require('shared/src/config');
const { bootServiceProvider } = require('shared/src/providers');

let startServer = () => {
  const app = require('./server')();
  bootServiceProvider.boot({
    APP: app,
    PORT: config.cmsPort,
    APP_NAME: 'Backend CMS Server'
  });
};
startServer();
