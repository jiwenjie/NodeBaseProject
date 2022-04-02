
/**
 * @Description:
 * @Author: 吉文杰
 * @Date: 2021-11-20 09:46:46
 * @LastEditors: 吉文杰
 * @LastEditTime: 2021-11-21 17:31:24
 * 数据库封装，sequelize 模块
 */
// 引入模块
let { Sequelize } = require('sequelize');
// 读取配置
import { config as mysqlConfig } from './mysqlConfig';
console.log('mysqlConfig--', mysqlConfig);

// 根据配置实例化 seq 并导出
export default new Sequelize(mysqlConfig.dbname, mysqlConfig.uname, mysqlConfig.upwd, {
    host: mysqlConfig.host,
    dialect: mysqlConfig.dialect,
    pool: mysqlConfig.pool
});

// 数据类型
// Sequelize.STRING 		//字符串,长度默认255,VARCHAR(255)
// Sequelize.STRING(1234)  //设定长度的字符串,VARCHAR(1234)
// Sequelize.STRING.BINARY   //定义类型VARCHAR BINARY
// Sequelize.TEXT           //长字符串,文本 TEXT
// Sequelize.TEXT('tiny')   //小文本字符串,TINYTEXT

// Sequelize.INTEGER      //int数字,int
// Sequelize.BIGINT       //更大的数字,BIGINT
// Sequelize.BIGINT(11)   //设定长度的数字,BIGINT(11)

// Sequelize.FLOAT        //浮点类型,FLOAT
// Sequelize.FLOAT(11)     //设定长度的浮点,FLOAT(11)
// Sequelize.FLOAT(11, 12)  //设定长度和小数位数的浮点,FLOAT(11,12)

// Sequelize.REAL     //REAL  PostgreSQL only.
// Sequelize.REAL(11) // REAL(11)    PostgreSQL only.
// Sequelize.REAL(11, 12)  // REAL(11,12) PostgreSQL only.

// Sequelize.DOUBLE     // DOUBLE
// Sequelize.DOUBLE(11)  // DOUBLE(11)
// Sequelize.DOUBLE(11, 12) // DOUBLE(11,12)

// Sequelize.DECIMAL     // DECIMAL
// Sequelize.DECIMAL(10, 2)  // DECIMAL(10,2)

// Sequelize.DATE    // 日期类型,DATETIME for mysql / sqlite, TIMESTAMP WITH TIME ZONE for postgres
// Sequelize.DATE(6) // mysql 5.6.4+支持,分秒精度为6位
// Sequelize.DATEONLY   // 仅日期部分
// Sequelize.BOOLEAN   // int类型,长度为1,TINYINT(1)

// Sequelize.ENUM('value 1', 'value 2')  // 枚举类型
// Sequelize.ARRAY(Sequelize.TEXT)  //PostgreSQL only.
// Sequelize.ARRAY(Sequelize.ENUM)  //  PostgreSQL only.

// Sequelize.JSON   // JSON column. PostgreSQL, SQLite and MySQL only.
// Sequelize.JSONB  // JSONB column. PostgreSQL only.

// Sequelize.BLOB   // BLOB (bytea for PostgreSQL)
// Sequelize.BLOB('tiny')  // TINYBLOB (bytea for PostgreSQL. Other options are medium and long)

// Sequelize.UUID  // PostgreSQL和SQLite的数据类型是UUID, MySQL是CHAR(36)类型

// Sequelize.CIDR  // PostgreSQL中的CIDR类型
// Sequelize.INET   // PostgreSQL中的INET类型
// Sequelize.MACADDR  // PostgreSQL中的MACADDR类型

// Sequelize.RANGE(Sequelize.INTEGER)    //PostgreSQL only.
// Sequelize.RANGE(Sequelize.BIGINT)     // PostgreSQL only.
// Sequelize.RANGE(Sequelize.DATE)       //PostgreSQL only.
// Sequelize.RANGE(Sequelize.DATEONLY)   //PostgreSQL only.
// Sequelize.RANGE(Sequelize.DECIMAL)    //PostgreSQL only.

// Sequelize.ARRAY(Sequelize.RANGE(Sequelize.DATE)) // PostgreSQL only.

// Sequelize.GEOMETRY   //PostgreSQL (with PostGIS) or MySQL only.
// Sequelize.GEOMETRY('POINT')  // PostgreSQL (with PostGIS) or MySQL only.
// Sequelize.GEOMETRY('POINT', 4326)// PostgreSQL (with PostGIS) or MySQL only.


// 校验内容
// Sequelize内置支持的验证还是非常的多的，如果这些都不满意，还可以自己定义一个。
// validate: {
//   is: ["^[a-z]+$",'i'],     // 全匹配字母
//   is: /^[a-z]+$/i,          // 全匹配字母，用规则表达式写法
//   not: ["[a-z]",'i'],       // 不能包含字母
//   isEmail: true,            // 检查邮件格式
//   isUrl: true,              // 是否是合法网址
//   isIP: true,               // 是否是合法IP地址
//   isIPv4: true,             // 是否是合法IPv4地址
//   isIPv6: true,             // 是否是合法IPv6地址
//   isAlpha: true,            // 是否是字母
//   isAlphanumeric: true,     // 是否是数字和字母
//   isNumeric: true,          // 只允许数字
//   isInt: true,              // 只允许整数
//   isFloat: true,            // 是否是浮点数
//   isDecimal: true,          // 是否是十进制书
//   isLowercase: true,        // 是否是小写
//   isUppercase: true,        // 是否大写
//   notNull: true,            // 不允许为null
//   isNull: true,             // 是否是null
//   notEmpty: true,           // 不允许为空
//   equals: 'specific value', // 等于某些值
//   contains: 'foo',          // 包含某些字符
//   notIn: [['foo', 'bar']],  // 不在列表中
//   isIn: [['foo', 'bar']],   // 在列表中
//   notContains: 'bar',       // 不包含
//   len: [2,10],              // 长度范围
//   isUUID: 4,                // 是否是合法 uuids
//   isDate: true,             // 是否是有效日期
//   isAfter: "2011-11-05",    // 是否晚于某个日期
//   isBefore: "2011-11-05",   // 是否早于某个日期
//   max: 23,                  // 最大值
//   min: 23,                  // 最小值
//   isArray: true,            // 是否是数组
//   isCreditCard: true,       // 是否是有效信用卡号
//   // 自定义规则
//   isEven: function(value) {
//   if(parseInt(value) % 2 != 0) {
//       throw new Error('请输入偶数!')
//   }
// }
