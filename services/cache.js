// import modules
const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');

// create redis client
const redisClient = redis.createClient(keys.redisUrl);

// promisyfy the hget
redisClient.hget = util.promisify(redisClient.hget);

// keep the original query exec prototype
const exec = mongoose.Query.prototype.exec;

// create a new prototype cache function to set if cache is enables
mongoose.Query.prototype.cache = function (options = { key: '' }) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key);

  return this;
}

// override the exec prototype function and add the logic to use cache
mongoose.Query.prototype.exec = async function () {
  // if not cache return actual exec
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  // check if cache has hashkey value then return the cache value
  var key = JSON.stringify(
    Object.assign({},
      this.getQuery(),
      { collection: this.mongooseCollection.name }
    ));
  var cacheValue = await redisClient.hget(this.hashKey, key);
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  // else get the result from actual exec
  const result = await exec.apply(this, arguments);

  // store the result in cache and return the result
  redisClient.hset(this.hashKey, key, JSON.stringify(result));
  redisClient.expire(this.hashKey, 10);
  return result;
}

module.exports = {
  clearHash(hashKey) {
    redisClient.del(JSON.stringify(hashKey));
  }
}