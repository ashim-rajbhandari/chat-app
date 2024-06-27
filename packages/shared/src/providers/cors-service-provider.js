const config = require('config');
const cors = require('cors');
const env = config.get('ENV');
module.exports = class CorsServiceProvider {
  static register(app, whitelist = []) {
    whitelist = [...whitelist];
    const corsConfig = {
      origin: true,
      credentials: true,
      methods: 'GET,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204
    };
    if (env === 'production') {
      corsConfig.origin = (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      };
    }
    app.use(cors(corsConfig));
  }
};
