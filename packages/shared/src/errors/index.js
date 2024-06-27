module.exports = Object.assign(
  {},
  require('./customError'),
  require('./multipleDeleteError'),
  require('./api/singleErrorFormat'),
  require('./api/multipleErrorFormat')
);
