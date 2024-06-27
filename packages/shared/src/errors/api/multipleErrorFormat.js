let constants = require('shared/src/constants');

exports.multipleErrorFormat = (errors) => {
  let mappedError = {};
  mappedError.meta = constants.meta;
  mappedError.errors = errors;
  return mappedError;
};
