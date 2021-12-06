/*
 * @Description: 主函数入口，相当于 Java 中得 main 方法
 * @Author: 吉文杰
 * @Date: 2021-11-20 09:46:46
 * @LastEditors: 吉文杰
 * @LastEditTime: 2021-11-21 17:31:24 
 */
import Koa, { Context } from "koa";
import koaBody from "koa-body";
import koaRouter from "koa-router";
import addRouter from "./router";
import logger from "koa-logger";
import log4js from "log4js";
import { ResultHandler } from './middleware/resultHandler'
import chalk from "chalk";
import cors from "koa2-cors";
import path from 'path'

// 实例化 Koa
const app = new Koa();
app.use(cors());
const router = new koaRouter();

const port = 3300;
const log4 = log4js.getLogger();
log4.level = "debug";

//日志打印
app.use(logger(info => {
  log4.debug(info);
}));

app.use(koaBody());

// 对所有请求进行拦截，打印出所有的请求和响应日志数据
app.use(async (ctx, next) => {
  log4.debug(path.dirname, chalk.green('请求body:  ') + JSON.stringify(ctx.request.body));
  await next()
  // chalk todo 控制台打印内容样式改变框架（用来设置控制台输出内容的颜色）
  // log4.debug(chalk.green('请求路径:  ') + ctx.request.url);
  log4.debug(path.dirname, chalk.green('返回数据:  ')+ JSON.stringify(ctx.body));
})

// 增加中间件，统一返回内容包裹体
//  执行结果 handler 用来给每个响应对象包装响应码等
app.use(ResultHandler());

//加载路由
addRouter(router);

//启动路由
app.use(router.routes()).use(router.allowedMethods());
app.use(async (ctx: Context) => {
  log4.error(`404 ${ctx.message} : ${ctx.href}`);
  ctx.status = 404;
  ctx.body = "404! api not found !";
});

// koa already had middleware to deal with the error, just register the error event
app.on("error", (err, ctx: Context) => {
  log4.error(err); //log all errors
  ctx.status = 500;
  if (ctx.app.env !== "development") {
    //throw the error to frontEnd when in the develop mode
    ctx.res.end(err.stack); //finish the response
  }
});

// 开启端口监听
app.listen(port, () => {
  log4.debug("mock server running at: http://localhost:%d", port);
});
