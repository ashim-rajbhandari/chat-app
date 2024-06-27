module.exports = Object.assign(
  {},
  require('./camelCaseParser'),
  require('./validate'),
  require('./verifyJWT'),
  require('./routeNotFoundHandler')
);
