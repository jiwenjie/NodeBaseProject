/*
 * @Author: jiwenjie5
 * @Date: 2021-12-10 10:53:05
 * @LastEditors: jiwenjie5
 * @LastEditTime: 2021-12-10 16:47:07
 * @FilePath: \vue-analysis-mastere:\VsWorkSpace\2021\12\NodeBaseProject\mock\config\sessionConfig.ts
 * @Github: https://github.com/jiwenjie
 */

// import Session from "koa-session";    // 导入 session，准备增加登录请求验证部分内容

// tips: 可以把 sesioon 存在全局变量中，定期清理，也可以把 session 存在 redis 缓存中，设置一个到期时间，到期后从 redis 中就会
// 获取不到该值，就认为登录状态失效。把 sessionId 存放在 Cookie 中实现。

// // 配置
// let session_signed_key = ["some-secret-jiwenjie"];  // 这个是配合signed属性的签名key
// let session_config = {
//     key: 'koa:sess',  /** cookie的key。 (默认是 koa:sess) */
//     maxAge: 9000,     /** session 过期时间，以毫秒ms为单位计算。*/
//     autoCommit: true, /** 自动提交到响应头。(默认是 true) */
//     overwrite: true,  /** 是否允许重写。(默认是 true) */
//     httpOnly: true,   /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */
//     signed: true,     /** 是否签名。(默认是 true) */
//     rolling: true,    /** 是否每次响应时刷新Session的有效期。(默认是 false) */
//     renew: false,     /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */
// };

// // 创建 session 
// const session = Session(session_config, app)
// app.keys = session_signed_key;
// // 使用中间件，注意有先后顺序
// app.use(session);

// 基本依赖和部分配置内容已添加好，不过目前主流使用的是 jwt 无状态验证，所以项目中打算增加 jwt，如果感兴趣的同学可以自己
// 手动完成增加测试