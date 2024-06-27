const jwt = require('jsonwebtoken');
const { token } = require('../config');

const getAccessToken = (payload) => {
  return {
    accessToken: jwt.sign(payload, token.accessTokenSecret, {
      algorithm: 'HS512',
      expiresIn: token.accessTokenExpiry
    }),
    accessTokenExpiresIn: token.accessTokenExpiry
  };
};
const getRefreshToken = (payload) => {
  return {
    refreshToken: jwt.sign(payload, token.refreshTokenSecret, {
      algorithm: 'HS512',
      expiresIn: token.refreshTokenExpiry
    }),
    refreshTokenExpiresIn: token.refreshTokenExpiry
  };
};

module.exports = {
  getAccessToken,
  getRefreshToken
};
