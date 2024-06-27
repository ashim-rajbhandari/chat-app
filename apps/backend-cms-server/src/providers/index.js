module.exports = {
  sessionStorageProvider: require('./session-storage-provider'),
  passportServiceProvider: require('./passport-service-provider'),
  viewEngineProvider: require('./view-engine-provider'),
  staticPathProvider: require('./static-path-provider'),
  reqLocalsProvider: require('./req-locals-providers'),
  localFunctionsProvider: require('./local-functions-provider')
};
