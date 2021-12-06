/*
 * @Description: 路由元数据类型定义，方法元数据类型定义，MiddleWare 中间件类型全局申明
 * @Author: 吉文杰
 * @Date: 2021-11-20 09:46:46
 * @LastEditors: 吉文杰
 * @LastEditTime: 2021-11-21 17:31:24 
 */
import { Context, Next } from "koa"

// type PlainObject = { [P: string]: any };
type PlainObject = Record<string, any>;
type ParamObject = Record<string, any>;
type MysqlResult = {
  affectedRows?: number;
  insertId?: string;
}

type PathMeta = {
  name: string;
  path: string;
}

type RouteMeta = {
  name: string;
  method: string;
  path: string;
  isVerify: boolean;
}

type MiddleWare = (...arg: any[]) => (ctx: Context, next?: Next) => Promise<void>;

export {
  MysqlResult,
  PlainObject,
  RouteMeta,
  MiddleWare,
  PathMeta,
  ParamObject
}