const jwt = require('jsonwebtoken');
const { token } = require('shared/src/config');
const { merchants } = require('shared/src/database/models');
const http = require('http-status-codes');
const statusCodeList = require('shared/src/constants/status-code-list');
const { singleErrorFormat } = require('shared/src/errors');

const verifyJWT = (req, res, next) => {
  const accessToken = req?.cookies?._accessToken;
  if (!accessToken) {
    return res.status(http.StatusCodes.UNAUTHORIZED).json(
      singleErrorFormat({
        statusCode: statusCodeList.UnauthorizedAccess,
        msg: 'Unauthorized'
      })
    );
  }
  jwt.verify(accessToken, token.accessTokenSecret, async (err, data) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(http.StatusCodes.UNAUTHORIZED).json(
          singleErrorFormat({
            statusCode: statusCodeList.TokenExpired,
            msg: 'Access token expired'
          })
        );
      }
      return res.status(http.StatusCodes.UNAUTHORIZED).json(
        singleErrorFormat({
          statusCode: statusCodeList.UnauthorizedAccess,
          msg: 'badData'
        })
      );
    }
    const merchantData = await merchants.count({
      where: {
        email: data.email
      }
    });
    if (merchantData === 0) {
      return res.status(http.StatusCodes.UNAUTHORIZED).json(
        singleErrorFormat({
          statusCode: statusCodeList.UnauthorizedAccess,
          msg: 'badData'
        })
      );
    }
    req.user = data;
    next();
  });
};

module.exports = { verifyJWT };
