/*
 * @Description:table列表接口 (此处保留不删除，展示 faker.js 模拟数据框架得使用方法)
 * @Author: 吉文杰
 * @Date: 2021-11-20 09:46:46
 * @LastEditors: 吉文杰
 * @LastEditTime: 2021-11-21 17:31:24
 */

import { post, prefix, get } from "../requestDecorator";
import faker from 'faker'

@prefix('/syncCaseItems')
export default class syncCaseItems {

  @get('/num')
  async num() {
    // console.log('ctx------------------', ctx)
    return {
        data: '啊是擦上擦擦是VS的'
    }
  }
}
