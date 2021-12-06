/*
 * @Description: 
 * @Autor: jiwenjie5
 * @Date: 2020-11-11 13:59:28
 * @LastEditors: jiwenjie5
 * @LastEditTime: 2021-12-06 08:40:55
 */
import log from '../utils/logger'
import { MiddleWare } from '../type'

export type ResultInfo = {
  code: number;
  msg?: string;
  data?: any;
  err?: any
}

/**
 * 执行结果 handler 用来给每个响应对象包装响应码等
 */
export const ResultHandler: MiddleWare = () => async (ctx, next) => {
  const res: ResultInfo= { code: 0 };
  try {
    const data: any = await next();
    res.code = 0;
    res.msg = 'success'
    res.data = data;
  } catch (err) {
    log.error(err);
    res.code = err.statusCode
    switch (err.statusCode) {
      case 102:
        res.msg = "用户不存在";
        break;
      default:
        break;
    }
  }
  ctx.body = res;
};