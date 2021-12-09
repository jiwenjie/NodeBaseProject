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
import Session from "koa-session";    // 导入 session，准备增加登录请求验证部分内容
import addRouter from "./router";
import logger from "koa-logger";
import log4js from "log4js";
import { ResultHandler } from './middleware/resultHandler'
import chalk from "chalk";
import cors from "koa2-cors";
import path from 'path';
import { initWebSocket } from "./utils/Socket";

// 准备添加 redis 使用，用户登录验证，cookie 和 session 部分内容
// koa 设置 cookie 之后会自动加上 HttpOnly 属性，直接把用户信息存放在 Cookie 中不够安全，此时可以考虑使用 session 存放

// tips: 可以把 sesioon 存在全局变量中，定期清理，也可以把 session 存在 redis 缓存中，设置一个到期时间，到期后从 redis 中就会
// 获取不到该值，就认为登录状态失效。把 sessionId 存放在 Cookie 中实现。

// 配置
const session_signed_key = ["some-secret-jiwenjie"];  // 这个是配合signed属性的签名key
const session_config = {
    key: 'koa:sess',  /** cookie的key。 (默认是 koa:sess) */
    maxAge: 9000,     /** session 过期时间，以毫秒ms为单位计算。*/
    autoCommit: true, /** 自动提交到响应头。(默认是 true) */
    overwrite: true,  /** 是否允许重写。(默认是 true) */
    httpOnly: true,   /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */
    signed: true,     /** 是否签名。(默认是 true) */
    rolling: true,    /** 是否每次响应时刷新Session的有效期。(默认是 false) */
    renew: false,     /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */
};

// 实例化 Koa
const port = 3300;
const app = new Koa();
app.use(cors());

// 创建 session 
const session = Session(session_config, app)
app.keys = session_signed_key;
// 使用中间件，注意有先后顺序
app.use(session);

// 实例化路由对象
const router = new koaRouter();

// 实例化日志对象
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
