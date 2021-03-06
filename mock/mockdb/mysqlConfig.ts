/*
 * @Author: 吉文杰
 * @Date: 2021-12-11 13:18:45
 * @LastEditTime: 2021-12-11 13:24:37
 * @LastEditors: 吉文杰
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /htmlTemplete/Users/jiwenjie/Desktop/codeWorkSpace/VsCodeSpace/do-it-myself/NodeBaseProject/mock/mockdb/mysqlConfig.ts
 */
// 连接池配置对象
type dnConfigPool = {
  max: Number,
  min: Number,
  idle: Number
}

// 数据库配置
type dbConfig = {
  dbname: String, // 数据库名称
  uname: String,  //  数据库登录名
  upwd: String, //  数据库登录密码
  host: String,  // 自定义链接地址，可以是ip或者域名，默认本机：localhost
  port: Number, // 数据库端口，mysql默认是3306 // 自定义端口，默认3306
  dialect: String, // 数据库类型，支持: 'mysql', 'sqlite', 'postgres', 'mssql'
  logging?: true, // 是否开始日志，默认是用console.log  // 建议开启，方便对照生成的sql语句
  pool: dnConfigPool // 连接池配置
}

let config: dbConfig = {
  dbname: 'unilink',
  uname: 'root',
  upwd: 'root',
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
}

export {
  config
}
