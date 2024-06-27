require('module-alias/register');
const config = require('config');
const cmsConf = config.get('cms');
const Boom = require('@hapi/boom');
const { viewsPath, isApiRequestOrAjax } = require('shared/src/helpers');
const { existsSync } = require('fs');
const { singleErrorFormat } = require('shared/src/errors');

require('dotenv').config();

const getRespectiveErrorView = (statusCode) =>
  existsSync(viewsPath(`error/${statusCode}.ejs`));

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (!Boom.isBoom(err)) {
    err = Boom.boomify(err);
  }

  const { statusCode, message } = err.output.payload;

  if (isApiRequestOrAjax(req)) {
    return res.status(statusCode).json(singleErrorFormat(err.output.payload));
  }

  if (cmsConf.CMS_DEBUG === true || cmsConf.CMS_DEBUG === undefined) {
    return res.render('error/error-stacktrace', {
      statusCode: statusCode,
      errorMessage: message,
      stackTrace: err.stack,
      reqMethod: req.method,
      reqUrl: `${cmsConf.CMS_URL}${req.originalUrl}`
    });
  }
  if (!getRespectiveErrorView(statusCode)) {
    return res.render('error/500', err.output.payload);
  }
  return res.render(`error/${statusCode}`, err.output.payload);
};

module.exports = errorHandler;
