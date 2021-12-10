/*
 * @Author: jiwenjie5
 * @Date: 2021-12-10 10:53:05
 * @LastEditors: jiwenjie5
 * @LastEditTime: 2021-12-10 16:47:07
 * @Github: https://github.com/jiwenjie
 */
const redis = require('redis');
const { promisify } = require("util");

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: '6376'
});

redisClient.on("error", function (err) {
  console.log("Error " + err);
});

function Client() {
  this.set = promisify(redisClient.set).bind(redisClient);
  this.get = promisify(redisClient.get).bind(redisClient);
  return this;
}

const client = new Client();

module.exports = client;
