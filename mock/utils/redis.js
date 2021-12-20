/*
 * @Author: jiwenjie5
 * @Date: 2021-12-10 10:53:05
 * @LastEditors: jiwenjie5
 * @LastEditTime: 2021-12-10 16:47:07
 * @Github: https://github.com/jiwenjie
 */
// import { resolve } from 'path'
// const r = path => resolve(__dirname, path)
const redis = require("redis");
import logUtils from './logger';

// redis配置参数
let redisConfig = {
  "host": "127.0.0.1",
  "port": 6379
};

let password = '';     //密码
const client = redis.createClient(redisConfig);
if (password) {
  client.auth(password, function () {
    logUtils.log("连接成功")
  });
}
client
  .on("error", err => logUtils.log('------ Redis connection failed ------' + err))
  .on('connect', () => logUtils.log('------ Redis connection succeed ------'));

let setKey = (key, value) => {
  return new Promise((resolve, reject) => {
    client.set(key, value, (err, replay) => {
      if (err) {
        logUtils.log('--- redis setKey error ---' + err);
        reject(err);
      } else {
        resolve(replay);
      }
    })
  })
};

let getKey = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, replay) => {
      if (err) {
        console.log('--- redis getKey error ---' + err);
        reject(err);
      } else {
        resolve(replay);
      }
    })
  })
};

module.exports = {
  setKey, getKey, client
}

// 使用 example
// import { getKey, setKey } from '../lib/redis';
// export async function generateToken({ _id, data }, timeout = 86400) {
//   let created = Math.floor(Date.now() / 1000);
//   let token = jwt.sign({
//     data,
//     exp: created + timeout
//   }, pri_cert, { algorithm: 'RS256' });
//   // 生成 token 保存在 redis 中
//   await setKey(_id, token)
//   return token;
// }