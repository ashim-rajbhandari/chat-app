require('module-alias/register');
const config = require('config');
const Boom = require('@hapi/boom');
const { singleErrorFormat } = require('shared/src/errors');
require('dotenv').config();

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (!Boom.isBoom(err)) {
    err = Boom.boomify(err);
  }
  const { statusCode } = err.output.payload;
  if (config.API_DEBUG === true || config.API_DEBUG === undefined) {
    console.log(err);
  }
  return res.status(statusCode).json(singleErrorFormat(err.output.payload));
};

module.exports = errorHandler;
