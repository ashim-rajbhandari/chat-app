let constants = require('shared/src/constants');

exports.singleErrorFormat = (error) => {
  let mappedError = {};
  let newError = [
    {
      code: error.param || error.statusCode,
      title: error.msg || error.message,
      detail: error.msg || error.message
    }
  ];

  mappedError['meta'] = constants.meta;
  mappedError['errors'] = newError;
  return mappedError;
};
