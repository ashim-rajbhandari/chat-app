const fileUpload = require('express-fileupload');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

module.exports = class CommonAppServiceProvider {
  static register(app, options) {
    app.use(compression());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(fileUpload());
    app.use(methodOverride('_method'));

    if (options?.overideCookieParser === undefined) {
      app.use(cookieParser());
    }
  }
};
