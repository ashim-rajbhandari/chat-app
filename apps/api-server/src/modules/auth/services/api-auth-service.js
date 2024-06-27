const {
  getAccessToken,
  getRefreshToken
} = require('shared/src/helpers/jwtHelper');
const config = require('config');
const { refreshToken, frontendUser } = require('shared/src/database/models');
const { token } = require('shared/src/config');
const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');
const { sanitizePayload, bcryptPassword } = require('shared/src/helpers');
const randtoken = require('rand-token');
const moment = require('moment');
const emailService = require('shared/src/services/email.service');
const emailServiceInstance = new emailService();
const {
  INVALID_EMAIL,
  NOT_FOUND,
  VERIFY_ACCOUNT
} = require('../../../error/error-message');
const { CustomError } = require('shared/src/errors');
const statusCodeList = require('shared/src/constants/status-code-list');

module.exports = class ApiAuthService {
  async login(payload) {
    const { email } = payload;
    let userData = await frontendUser.findOne({
      where: {
        email,
        is_verified: true
      },
      attributes: ['id', 'password']
    });
    if (!userData) {
      throw Boom.unauthorized(VERIFY_ACCOUNT);
    }
    return this.newAccessAndRefreshToken({
      id: userData.id,
      email
    });
  }

  async newAccessAndRefreshToken(tokenPayload) {
    const { id } = tokenPayload;
    const accessTokenData = getAccessToken(tokenPayload);
    const refreshTokenData = getRefreshToken(tokenPayload);
    let refreshTokenPaylaod = {
      refresh_token: refreshTokenData.refreshToken,
      fe_user_id: id,
      expires_at: refreshTokenData.refreshTokenExpiresIn,
      is_revoked: false
    };
    await refreshToken.create(refreshTokenPaylaod);
    return {
      id,
      accessToken: accessTokenData.accessToken,
      refreshToken: refreshTokenData.refreshToken
    };
  }

  async revokeRefreshToken(UserRefreshToken) {
    const foundRefreshToken = await refreshToken.findOne({
      where: {
        refresh_token: UserRefreshToken
      }
    });
    if (foundRefreshToken) {
      await refreshToken.update(
        {
          is_revoked: true
        },
        {
          where: {
            refresh_token: UserRefreshToken
          }
        }
      );
      return { id: foundRefreshToken.fe_user_id };
    }
  }

  async validateAndGetNewTokens(cookieRefreshToken) {
    if (!cookieRefreshToken) {
      throw new CustomError({
        statusCode: statusCodeList.InvalidRefreshToken,
        msg: 'Invalid Refresh Token'
      });
    }
    const foundRefreshToken = await refreshToken.findOne({
      where: {
        refresh_token: cookieRefreshToken,
        is_revoked: false
      },
      include: [
        {
          model: frontendUser,
          as: 'feUserData',
          attributes: ['email', 'id']
        }
      ]
    });
    if (!foundRefreshToken) {
      throw new CustomError({
        statusCode: statusCodeList.InvalidRefreshToken,
        msg: 'Invalid Refresh Token'
      });
    }
    return jwt.verify(
      cookieRefreshToken,
      token.refreshTokenSecret,
      async (err, decoded) => {
        if (err && err instanceof jwt.TokenExpiredError) {
          throw new CustomError({
            statusCode: statusCodeList.TokenExpired,
            msg: 'Refresh Token Expired'
          });
        }
        if (!err && foundRefreshToken.feUserData?.email !== decoded.email) {
          throw new CustomError({
            statusCode: statusCodeList.InvalidRefreshToken,
            msg: 'Invalid Refresh Token'
          });
        }
        //invoke refreshtoken
        await this.revokeRefreshToken(cookieRefreshToken);
        //create new access and refresh Token's
        return this.newAccessAndRefreshToken({
          id: foundRefreshToken.feUserData.id,
          email: decoded.email
        });
      }
    );
  }

  async verifyToken(token) {
    const data = await frontendUser.findOne({
      where: {
        token
      }
    });
    if (!data) {
      throw Boom.notFound(NOT_FOUND);
    }
    const updateData = {
      token: null,
      is_verified: true
    };
    return frontendUser.update(updateData, {
      where: { token },
      individualHooks: true
    });
  }

  async accountRegister(payload) {
    const filteredPayload = sanitizePayload(
      payload,
      'full_name',
      'phone_num',
      'email',
      'address'
    );
    filteredPayload['password'] = bcryptPassword(payload.password, 10);
    filteredPayload['token'] = randtoken.generate(10);
    const data = await frontendUser.create(filteredPayload);
    const emailPayload = {
      email: [data.email],
      code: 'register_feuser',
      username: data.full_name,
      token: data.token,
      url: `${config.FRONTEND_URL}/auth/verify/${data.token}`
    };
    emailServiceInstance.sendSMTPEmail(emailPayload);
    return data;
  }

  async handleForgotPasswordMail(email) {
    let frontendUserData = await frontendUser.findOne({
      where: {
        email
      }
    });
    if (frontendUserData == null) {
      throw Boom.notFound(INVALID_EMAIL);
    }
    try {
      const token = randtoken.generate(10);
      let expiryHour = 24;
      let expiryDate = moment().add(expiryHour, 'hours');
      let updateData = {
        reset_password_token: token,
        reset_password_expires: expiryDate
      };
      await frontendUser.update(updateData, {
        where: { _id: frontendUserData._id },
        individualHooks: true
      });
      const emailPayload = {
        email: [email],
        code: 'forgot_password',
        username: frontendUserData.full_name,
        token: token,
        url: `${config.FRONTEND_URL}/auth/reset-password/${token}`
      };
      emailServiceInstance.sendSMTPEmail(emailPayload);
      return frontendUserData.id;
    } catch (e) {
      throw Boom.badRequest(e);
    }
  }

  async resetPassword(payload) {
    const { password, token } = payload;
    const hashround = 10;
    const updateData = {
      password: bcryptPassword(password, hashround),
      reset_password_token: null,
      reset_password_expires: null
    };
    return frontendUser.update(updateData, {
      where: { reset_password_token: token },
      individualHooks: true
    });
  }

  removeUserByEmail(email) {
    return frontendUser.destroy({
      where: {
        email
      }
    });
  }
};
