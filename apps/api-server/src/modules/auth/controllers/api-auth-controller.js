const config = require('config');
const controller = require('shared/src/controllers/apiBaseController');
const env = config.get('ENV');
const http = require('http-status-codes');
const { singleErrorFormat } = require('shared/src/errors');

module.exports = class ApiAuthController extends controller {
  constructor(opts) {
    super(opts);
    this.service = opts.apiAuthService;
  }

  async login(req, res) {
    const data = await this.service.login({
      email: req.body.username
    });
    this.setTokensToCookie(res, {
      _accessToken: data?.accessToken,
      _refreshToken: data?.refreshToken
    });
    return this.respondOk(res, { msg: 'Logged-in Successfully' });
  }

  async logout(req, res) {
    const refreshToken = req?.cookies?._refreshToken;
    if (!refreshToken) {
      return this.noContent(res);
    }
    this.service.revokeRefreshToken(refreshToken);
    this.clearTokensFromCookie(res);
    return this.noContent(res);
  }

  async refreshToken(req, res) {
    try {
      const data = await this.service.validateAndGetNewTokens(
        req?.cookies?._refreshToken
      );
      this.setTokensToCookie(res, {
        _accessToken: data?.accessToken,
        _refreshToken: data?.refreshToken
      });
      return this.noContent(res);
    } catch (err) {
      this.clearTokensFromCookie(res);
      return res.status(http.StatusCodes.UNAUTHORIZED).json(
        singleErrorFormat({
          statusCode: err?.statusCode || 500,
          message: err?.msg || 'Internal Server Error'
        })
      );
    }
  }

  async accountRegister(req, res) {
    await this.service.accountRegister(req.body);
    return this.respondOk(res, {
      message: 'Please check your email to verify your account.'
    });
  }

  async verifyToken(req, res) {
    await this.service.verifyToken(req.params?.token);
    return this.respondOk(res, {
      message: 'Your email has been verified successfully.'
    });
  }

  async handleForgotPassword(req, res) {
    await this.service.handleForgotPasswordMail(req.body?.email);
    return this.respondOk(res, {
      message: 'Password reset token is sent to your email.'
    });
  }

  async handleResetPassword(req, res) {
    await this.service.resetPassword(req.body);
    return this.respondOk(res, {
      message: 'Password resetted successfully.'
    });
  }

  async removeUserByEmail(req, res) {
    try {
      await this.service.removeUserByEmail(req.params.email);
      return this.respondOk(res, {
        message: 'Email Deleted.'
      });
    } catch (error) {
      return res.status(500).send({
        msg: 'Error'
      });
    }
  }

  setTokensToCookie(res, tokens) {
    Object.keys(tokens).forEach((key) => {
      res.cookie(key, tokens[key], {
        httpOnly: true,
        sameSite: 'None',
        secure: env === 'production'
      });
    });
  }

  clearTokensFromCookie(res) {
    const tokens = ['_accessToken', '_refreshToken'];
    tokens.forEach((token) => {
      res.clearCookie(token, {
        httpOnly: true,
        sameSite: 'None',
        secure: env === 'production'
      });
    });
  }
};
