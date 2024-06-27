const session = require('express-session');
let RedisStore = require('connect-redis')(session);
const configuration = require('config');
const redisConf = configuration.get('redis');
const constantsConfig = require('../config');
const { redisClient } = require('../config/redis');
const cmsConf = configuration.get('cms');
const env = configuration.get('ENV');
module.exports = class SessionStorageProvider {
  static register(app) {
    redisClient.on('error', function (err) {
      console.log('Could not establish a connection with redis. ' + err);
    });
    redisClient.on('connect', function () {
      console.log('Connected to redis successfully');
    });

    app.use(
      session({
        store: new RedisStore({
          client: redisClient,
          ttl: redisConf.REDIS_TTL * 1000
        }),
        secret: cmsConf.SESSION_SECRET || 'payment_aggregator',
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: env !== 'development', // if true only transmit cookie over https
          httpOnly: true, // if true prevent client side JS from reading the cookie
          maxAge: constantsConfig.cookieMaxAge * 1000 // session max age in miliseconds
        }
      })
    );
  }
};
