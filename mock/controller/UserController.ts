/*
 * @Description: 用户相关接口
 * @Author: 吉文杰
 * @Date: 2021-12-28 09:46:46
 * @LastEditors: 吉文杰
 * @LastEditTime: 2021-01-21 17:31:24
 */
import { post, prefix, get } from "../requestDecorator";
import SequelizeInstance from "../mockdb/db";   // 导入数据库实例信息
import logUtils from '../utils/logger';    // 导入日志工具
import { Op } from "sequelize/dist";    // 从库中导入运算符，Op中包含多种各式各样得运算符
let { Sequelize, Model, DataTypes } = require('sequelize');

// 创建用户 model
const usersModel = SequelizeInstance.define('user', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // 或 Sequelize.UUIDV1
    primaryKey: true,       //主键
    // autoIncrement: true,    //自增
    comment: "自增id"       //注释:只在代码中有效
  },
  //用户名
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,   // 唯一键值
    // validate:{
    //   isEmail: true,   //类型检测,是否是邮箱格式
    // }
  },
  //密码
  pwd: {
    type: DataTypes.STRING(255),
    allowNull: false, //不允许为null
  },
  //昵称
  nickname: {
    type: DataTypes.STRING
  },
}, {
  //使用自定义表名
  freezeTableName: true,  // 设置为 true 表示数据库中得实际表名就是 define 后定义得名称
  //去掉默认的添加时间和更新时间
  timestamps: false,
  // indexes:[
  //   //普通索引,默认BTREE
  //     {
  //         unique: true,
  //         fields: ['pid']
  //     },
  //  ]
})

//同步: 没有就新建,有就不变
usersModel.sync();
// //先删除后同步
// users.sync({
//   force: true
// });

export interface UserModel {
  id: String,   // uuid key 值
  username: String,   // tips，有个问题，如何设置 ts 属性不可为空值
  pwd: String,
  nickname: String
}

/**
 * 用户相关 Controller，控制
 * @export
 * @class UserController
 */
@prefix('/userController')
export default class UserController {

  @post('/createUser')
  async createUser(ctx: any) {
    const { username, pwd, nickname } = ctx.request.body;
    let userNodel = {
      username,
      pwd,
      nickname
    }
    // create 方法为 build 和 save 的结合 
    // Sequelize提供了 create 方法,该方法将上述的 build 方法和 save 方法合并为一个方法：
    try {
      let user = await usersModel.create(userNodel);
      return user;
    } catch (exception) {
      console.log('exception-created response', exception);
      // 捕获异常
      return {
        errorCode: 10001,
        message: exception
      }
    }
  }

  @post('/deleteUser')
  async deleteUser(ctx: any) {
    const { id } = ctx.request.query;
    if (!id) {
      logUtils.error("/userController/userInfo---- id 值不能为空");
      return {
        errorCode: 7001,
        message: "id Params val is Null"
      }
    }
    // create 方法为 build 和 save 的结合 
    // Sequelize提供了 create 方法,该方法将上述的 build 方法和 save 方法合并为一个方法：
    try {
      let user = await usersModel.destroy({
        where: {
          id: id
        }
      });
      return user;
    } catch (exception) {
      console.log('exception-created response', exception);
      // 捕获异常
      return {
        errorCode: 10001,
        message: exception
      }
    }
  }

  @post('/updateUserInfo')
  async updateUserInfo(ctx: any) {
    const { id, username, pwd, nickname } = ctx.request.body;
    if (!id) {
      logUtils.error("/userController/userInfo---- id 值不能为空");
      return {
        errorCode: 7001,
        message: "id Params val is Null"
      }
    }
    // create 方法为 build 和 save 的结合 
    // Sequelize提供了 create 方法,该方法将上述的 build 方法和 save 方法合并为一个方法：
    try {
      let updateUser = {
        id,
        username,
        pwd,
        nickname
      }
      let user = await usersModel.update(updateUser, {
        where: {
          id
        }
      });
      return user;
    } catch (exception) {
      console.log('exception-created response', exception);
      // 捕获异常
      return {
        errorCode: 10001,
        message: exception
      }
    }
  }

  @get('/userInfo')
  async getUserInfo(ctx: any) {
    logUtils.debug('userInfo -- ', ctx.request.query);
    const { id } = ctx.query;
    logUtils.debug('userInfo id Val is -- ', id);
    if (!id) {
      logUtils.error("/userController/userInfo---- id 值不能为空");
      return {
        errorCode: 7001,
        message: "id Params val is Null"
      }
    }

    // findByPk
    // findByPk 方法使用提供的主键从表中仅获得一个条目.
    //     const project = await Project.findByPk(123);
    //     if (project === null) {
    //       console.log('Not found!');
    //     } else {
    //       console.log(project instanceof Project); // true
    //       // 它的主键是 123
    //     }

    try {
      // findOne 方法获得它找到的第一个条目(它可以满足提供的可选查询参数).
      let user = await usersModel.findOne({
        where: {
          id
        }
      })
      return user;
    } catch (exception) {
      console.log('exception-created response', exception);
      // 捕获异常
      return {
        errorCode: 10001,
        message: exception
      }
    }
  }

  @post('/loadUserList')
  async loadUserList(ctx: any) {
    logUtils.debug('userInfo -- ', ctx.request.body);
    const { pageNo = 1, limit = 15, username } = ctx.request.body;

    try {
      // 正常只是返回全部数据得方法
      // let result = await usersModel.findAll({
      //   offset: pageNo === 1 ? 0 : (pageNo - 1) * limit,
      //   limit,
      //   where: {
      //     // username   // 精确查询
      //     username: {
      //       // 模糊查询
      //       [Op.like]: '%' + username + '%'
      //     }
      //   }
      // })
      // return result;


      // 如果想要同时返回总 count 数量,则使用 findAndCountAll 方法
      let { count, rows } = await usersModel.findAndCountAll({
        offset: pageNo === 1 ? 0 : (pageNo - 1) * limit,
        limit,
        where: {
          username: {
            [Op.like]: '%' + username + '%'
          }
        },
        distinct: true,   // 去重，如果不加可能会出现 Count 数量错误得情况
      })
      return {
        count,
        rows
      };
    } catch (exception) {
      console.log('exception-created response', exception);
      // 捕获异常
      return {
        errorCode: 10001,
        message: exception
      }
    }
  }
}

// method Desc
// findOrCreate
// 除非找到一个满足查询参数的结果,否则方法 findOrCreate 将在表中创建一个条目. 在这两种情况下,它将返回一个实例(找到的实例或创建的实例)和一个布尔值,指示该实例是已创建还是已经存在.

// 使用 where 参数来查找条目,而使用 defaults 参数来定义必须创建的内容. 如果 defaults 不包含每一列的值,则 Sequelize 将采用 where 的值(如果存在).

// 假设我们有一个空的数据库,该数据库具有一个 User 模型,该模型具有一个 username 和一个 job
// const [user, created] = await User.findOrCreate({
//   where: { username: 'sdepold' },
//   defaults: {
//     job: 'Technical Lead JavaScript'
//   }
// });
// console.log(user.username); // 'sdepold'
// console.log(user.job); // 这可能是也可能不是 'Technical Lead JavaScript'
// console.log(created); // 指示此实例是否刚刚创建的布尔值
// if (created) {
//   console.log(user.job); // 这里肯定是 'Technical Lead JavaScript'
// }

/************************************************************************************ */

// Op 自包括得部分基础运算符
//  // 基本
//  [Op.eq]: 3,                              // = 3
//  [Op.ne]: 20,                             // != 20
//  [Op.is]: null,                           // IS NULL
//  [Op.not]: true,                          // IS NOT TRUE
//  [Op.or]: [5, 6],                         // (someAttribute = 5) OR (someAttribute = 6)

//  // 使用方言特定的列标识符 (以下示例中使用 PG):
//  [Op.col]: 'user.organization_id',        // = "user"."organization_id"

//  // 数字比较
//  [Op.gt]: 6,                              // > 6
//  [Op.gte]: 6,                             // >= 6
//  [Op.lt]: 10,                             // < 10
//  [Op.lte]: 10,                            // <= 10
//  [Op.between]: [6, 10],                   // BETWEEN 6 AND 10
//  [Op.notBetween]: [11, 15],               // NOT BETWEEN 11 AND 15

//  // 其它操作符

//  [Op.all]: sequelize.literal('SELECT 1'), // > ALL (SELECT 1)

//  [Op.in]: [1, 2],                         // IN [1, 2]
//  [Op.notIn]: [1, 2],                      // NOT IN [1, 2]

//  [Op.like]: '%hat',                       // LIKE '%hat'
//  [Op.notLike]: '%hat',                    // NOT LIKE '%hat'
//  [Op.startsWith]: 'hat',                  // LIKE 'hat%'
//  [Op.endsWith]: 'hat',                    // LIKE '%hat'
//  [Op.substring]: 'hat',                   // LIKE '%hat%'
//  [Op.iLike]: '%hat',                      // ILIKE '%hat' (不区分大小写) (仅 PG)
//  [Op.notILike]: '%hat',                   // NOT ILIKE '%hat'  (仅 PG)
//  [Op.regexp]: '^[h|a|t]',                 // REGEXP/~ '^[h|a|t]' (仅 MySQL/PG)
//  [Op.notRegexp]: '^[h|a|t]',              // NOT REGEXP/!~ '^[h|a|t]' (仅 MySQL/PG)
//  [Op.iRegexp]: '^[h|a|t]',                // ~* '^[h|a|t]' (仅 PG)
//  [Op.notIRegexp]: '^[h|a|t]',             // !~* '^[h|a|t]' (仅 PG)

//  [Op.any]: [2, 3],                        // ANY ARRAY[2, 3]::INTEGER (仅 PG)
//  [Op.match]: Sequelize.fn('to_tsquery', 'fat & rat') // 匹配文本搜索字符串 'fat' 和 'rat' (仅 PG)

//  // 在 Postgres 中, Op.like/Op.iLike/Op.notLike 可以结合 Op.any 使用:
//  [Op.like]: { [Op.any]: ['cat', 'hat'] }  // LIKE ANY ARRAY['cat', 'hat']