/*
 * @Description: 
 * @Author: 吉文杰
 * @Date: 2021-11-20 09:46:46
 * @LastEditors: 吉文杰
 * @LastEditTime: 2021-11-21 17:31:24
 */
import { get } from "../requestDecorator";
export default class Ping {
  @get('/ping')
  async ping() {
    return 'pong'
  }
}