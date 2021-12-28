/*
 * @Description: 主函数入口，相当于 Java 中得 main 方法
 * @Author: 吉文杰
 * @Date: 2021-11-20 09:46:46
 * @LastEditors: jiwenjie5
 * @LastEditTime: 2021-12-27 20:11:04
 */
import Koa, { Context } from "koa";
import koaBody from "koa-body";
import koaRouter from "koa-router";
import addRouter from "./router";
import logger from "koa-logger";
import log4js from "log4js";
import { ResultInfo, ResultHandler } from './middleware/resultHandler'
import chalk from "chalk";    // 控制日志输出颜色的库内容
import cors from "koa2-cors";
import path from 'path';
import { whiteList } from './config/whiteListConfig';
import { initWebSocket } from "./utils/Socket";

// 准备添加 redis 使用，用户登录验证，cookie 和 session 部分内容
// koa 设置 cookie 之后会自动加上 HttpOnly 属性，直接把用户信息存放在 Cookie 中不够安全，此时可以考虑使用 session 存放

// 实例化 Koa
const port = 3300;
const app = new Koa();
// 在前后端交互中，头部信息也是很关键的一步，通过对头部信息的配置，可以对请求作出一些限制，或者是一些优化。
// 这里我会使用 koa2-cors 为例子，来对跨域做cors处理（部分代码省略）。
// 可以做如下类似配置
// app.use(cors({
//     origin: function(ctx) {
//       return 'http://127.0.0.1:5500';//cors
//     },
//     exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//     maxAge: 5,
//     credentials: true,
//     allowMethods: ['GET', 'POST'],
//     allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
// }))
app.use(cors());

// 实例化路由对象
const router = new koaRouter();

// 实例化日志对象
const log4 = log4js.getLogger();
log4.level = "debug";

//日志打印
app.use(logger(info => {
  log4.debug(info);
}));

// koa-body 是 koa 的一个正文解析器中间件，他参考了 multer 模块，并加了点扩充功能
// 可以处理
// multipart/form-data
// application/x-www-urlencoded
// application/json
// application/json-patch+json
// application/vnd.api+json
// application/csp-report
// text/xml
// 不一定需要 koa 支持，也可以直接使用 node
// 支持文件上传
// 支持正文、字段和文件大小限制
app.use(koaBody());

// 对所有请求进行拦截，打印出所有的请求和响应日志数据
// koa 中中间件传参把参数挂在 ctx.state.xxxxxxx 上 即可，无法直接通过 next 对象传参
app.use(async (ctx, next) => {
  log4.debug(path.dirname, chalk.green('请求body:  ') + JSON.stringify(ctx.request.body));
  let interfaceUrl = ctx.request.url;
  // 如果判断是白名单中的内容
  if (whiteList.includes(interfaceUrl)) {
    // 在白名单中，直接放行
    await next();
  } else {
    // 校验请求 cookie 是否存在
    let sessionId = ctx.cookies.get('sessionId');
    if (!sessionId) {
      log4.debug(path.dirname, chalk.green('请求中 sessionId 不存在: 返回错误信息'));

      let res: ResultInfo = {
        code: 401,
        msg: "Authortiod, please login",
        data: "plaseLogin"
      }
      ctx.body = res;
      return;
    } else {
      // 如果有 sessionId 值则去 redis 缓存中查询是否存在，存在即未过期，不存在则表示过期
      // 如果查到则直接下一步
      // 取出对象
      await next();
    }
  }
  // await next()
  // chalk todo 控制台打印内容样式改变框架（用来设置控制台输出内容的颜色）
  // log4.debug(chalk.green('请求路径:  ') + ctx.request.url);
  log4.debug(path.dirname, chalk.green('返回数据:  ') + JSON.stringify(ctx.body));
})

// 增加中间件，统一返回内容包裹体
//  执行结果 handler 用来给每个响应对象包装响应码等
app.use(ResultHandler());

// 加载路由
addRouter(router);

// 启动路由
app.use(router.routes())
   .use(router.allowedMethods());

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

// 初始化 socket 连接
let serverInstance = initWebSocket(true);
// close 方法关闭 socket 连接
// serverInstance.close();

// 开启端口监听
app.listen(port, () => {
  log4.debug("mock server running at: http://localhost:%d", port);
});
