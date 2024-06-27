const config = require('config');
const db = config.get('db');
module.exports = {
  development: {
    username: db.POSTGRES_USER,
    password: db.POSTGRES_PASSWORD,
    database: db.POSTGRES_DB,
    host: db.POSTGRES_HOST,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      useUTC: false
    },
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
      acquire: 20000
    }
  },
  production: {
    username: db.POSTGRES_USER,
    password: db.POSTGRES_PASSWORD,
    database: db.POSTGRES_DB,
    host: db.POSTGRES_HOST,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      useUTC: false
    },
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
      acquire: 20000
    }
  }
};
