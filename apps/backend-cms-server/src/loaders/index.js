require('module-alias/register');
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const {
  commonAppServiceProvider,
  containerServiceProvider
} = require('shared/src/providers');
const {
  staticPathProvider,
  viewEngineProvider,
  sessionStorageProvider,
  passportServiceProvider,
  reqLocalsProvider,
  localFunctionsProvider
} = require('backend-cms/src/providers');
const configuration = require('config');
const cmsConf = configuration.get('cms');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorHandler = require('shared/src/handler/error-handler');
const { routeNotFoundHandler } = require('shared/src/middlewares');

const bootstrap = (app) => {
  commonAppServiceProvider.register(app, {
    overideCookieParser: true
  });
  containerServiceProvider.containerSetup();
  staticPathProvider.register(
    app,
    express.static(path.join(__dirname, '../../public'))
  );
  viewEngineProvider.register(app, {
    engine: 'ejs',
    viewPath: path.join(__dirname, '../views')
  });
  sessionStorageProvider.register(app);
  passportServiceProvider.register(app, passport);
  app.use(
    cookieParser(cmsConf.COOKIE_SECRET, {
      httponly: true,
      domain: process.env.DOMAIN
    })
  );
  reqLocalsProvider.register(app);
  localFunctionsProvider.register(app);
  app.use(require('./routes'));
  app.use('/resources', express.static(path.join(__dirname, '../../resources')));
  routeNotFoundHandler(app);
  app.use(errorHandler);
};

module.exports = { bootstrap };
