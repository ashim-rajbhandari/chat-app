let constants = require('shared/src/constants');

module.exports = {
  responseFormat: function (response, pagination) {
    let responseObject = {};
    let meta = {
      copyright: constants.COPYRIGHT,
      email: constants.COPYRIGHTEMAIL,
      api: {
        version: constants.VERSION
      },
      pagination
    };
    responseObject.meta = meta;
    responseObject.data = response;
    return responseObject;
  }
};
