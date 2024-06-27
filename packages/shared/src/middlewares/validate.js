const http = require('http-status-codes');
const { validationResult } = require('express-validator');
const { multipleErrorFormat } = require('shared/src/errors');
const { isApiRequestOrAjax } = require('shared/src/helpers');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let mappedErrors = errors.array();

    if (isApiRequestOrAjax(req)) {
      mappedErrors = mappedErrors.map((item) => {
        return {
          param: item?.param,
          title: item.msg,
          detail: item.msg
        };
      });

      return res
        .status(http.StatusCodes.UNPROCESSABLE_ENTITY)
        .json(multipleErrorFormat(mappedErrors));
    }

    req.flash('errors', mappedErrors);
    req.flash('inputData', req.body);
    return res.redirect('back');
  }
  return next();
};
module.exports = { validate };
