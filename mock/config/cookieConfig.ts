/*
 * @Description: cookie 部分配置内容
 * @Author: 吉文杰
 * @Date: 2021-11-20 09:46:46
 * @LastEditors: 吉文杰
 * @LastEditTime: 2021-11-21 17:31:24 
 */
export let cookieConfig = {
    maxAge: 10 * 60 * 1000, // cookie有效时长
    httpOnly: true,  // 是否只用于http请求中获取
    overwrite: false,  // 是否允许重写
    signed: true    //是否添加签名
}