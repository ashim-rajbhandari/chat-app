const { camelCaseParser } = require('shared/src/helpers');

function camelCaseParserMiddleware(req, res, next) {
  let newReqBody = {};
  for (const [key, value] of Object.entries(req.body)) {
    let newKey = camelCaseParser(key);
    newReqBody[newKey] = value;
  }
  req.body = newReqBody;
  next();
}
module.exports = {
  camelCaseParserMiddleware
};
