require('module-alias/register');
const globalErrorHandler = require('shared/src/handler/api-error-handler');
const {
  commonAppServiceProvider,
  containerServiceProvider,
  corsServiceProvider,
  bootServiceProvider
} = require('shared/src/providers');
const { apiPort } = require('shared/src/config');

const bootstrap = (app) => {
  commonAppServiceProvider.register(app);
  containerServiceProvider.containerSetup();
  corsServiceProvider.register(app, ['http://localhost:3000']);
  app.use('/api', require('./routes'));
  app.use(globalErrorHandler);
  bootServiceProvider.boot({
    APP: app,
    PORT: apiPort,
    APP_NAME: 'API Server'
  });
};

module.exports = { bootstrap };
