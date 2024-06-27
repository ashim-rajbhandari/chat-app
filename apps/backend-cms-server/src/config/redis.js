const redis = require('redis');
const config = require('config');
const redisConf = config.get('redis');

const redisClient = redis.createClient({
  host: redisConf.REDIS_HOST,
  port: redisConf.REDIS_PORT
});

const getRedisValue = (key) => {
  return new Promise(function (resolve, reject) {
    {
      redisClient.get(key, function (err, value) {
        if (err) {
          reject(err);
        }
        try {
          value = JSON.parse(value);
        } catch (e) {
          resolve(value);
        }
        resolve(value);
      });
    }
  });
};

const setRedisValue = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  redisClient.set(key, value);
};

const setRedisValueWithTTL = (key, value, rem = 1800) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  redisClient.set(key, value, 'EX', rem);
};

const deleteKey = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (err) => {
      if (err) {
        reject(err);
      }
      resolve(1);
    });
  });
};

const keyExist = (key) => {
  return new Promise(function (resolve) {
    redisClient.exists(key, function (err, reply) {
      if (reply === 1) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

const clearPaginationCache = async (key) => {
  for (let i = 1; i <= 50; i++) {
    const cacheKey = `${key}_${i}`;
    if (await keyExist(cacheKey)) {
      await deleteKey(cacheKey);
    }
  }
};

const clearInstructionStepsCache = async (key, id) => {
  const cacheKey = `${key}_${id}`;
  if (await keyExist(cacheKey)) {
    await deleteKey(cacheKey);
  }
};

module.exports = {
  getRedisValue,
  setRedisValue,
  setRedisValueWithTTL,
  deleteKey,
  redisClient,
  keyExist,
  clearPaginationCache,
  clearInstructionStepsCache
};
