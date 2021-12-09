/*
 * @Description: 测试 sequelize 中的关联关系接口 controller（此处为 1 对 N）
 * @Author: 吉文杰
 * @Date: 2021-12-28 09:46:46
 * @LastEditors: 吉文杰
 * @LastEditTime: 2021-01-21 17:31:24
 */
import { post, prefix, get } from "../requestDecorator";
import { createModel } from "../mockdb/ModelUtils";
import logUtils from '../utils/logger';    // 导入日志工具
import { Op } from "sequelize/dist";    // 从库中导入运算符，Op中包含多种各式各样得运算符
let { Sequelize, DataTypes } = require('sequelize');

// 创建 leader model
const leaderModelInstance = createModel('leader', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // 或 Sequelize.UUIDV1
    primaryKey: true,       //主键
    // autoIncrement: true,    //自增
    comment: "自增id"       //注释:只在代码中有效
  },
  //名称
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,   // 唯一键值
    // validate:{
    //   isEmail: true,   //类型检测,是否是邮箱格式
    // }
  },

  //年纪
  age: {
    type: DataTypes.INTEGER
  },
})

// 创建 task model
const taskModelInstance = createModel('task', {
  // id 主键
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // 或 Sequelize.UUIDV1
    primaryKey: true,       //主键
    // autoIncrement: true,    //自增
    comment: "自增id"       //注释:只在代码中有效
  },
  // 外键
  leaderId: {
    type: DataTypes.UUID,
    // defaultValue: Sequelize.UUIDV4, // 或 Sequelize.UUIDV1
  },

  // 任务名称
  taskName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // 等级
  level: {
    type: DataTypes.STRING,
  }
})


// tips：important，此处指定的外键必须在 model 中定义
leaderModelInstance.hasMany(taskModelInstance, {
  foreignKey: 'leaderId',
  sourceKey: 'id'
});   // 设置一对多管理
taskModelInstance.belongsTo(leaderModelInstance); // 设置一对多管理

export interface ILeaderModel {
  id: String,   // uuid key 值
  name: String,   // tips，有个问题，如何设置 ts 属性不可为空值
  age: Number,    // 年纪
}

export interface ITaskModek {
  id: String,   // uuid key 值
  taskName: String,   // tips，有个问题，如何设置 ts 属性不可为空值
  level: "1" | "2" | "3",   // level 等级，1-简单，2-普通，3-困难
}


/**
 * 用户相关 Controller，控制
 * @export
 * @class UserController
 */
@prefix('/AssociateController')
export default class UserController {

  /** 创建 leader */
  @post('/createLeader')
  async createLeader(ctx: any) {
    //   {
    //     "name":"testName010",
    //     "age": 55
    // }
    const { name, age } = ctx.request.body;
    let leaderModel = {
      name,
      age
    }
    // // create 方法为 build 和 save 的结合 
    // // Sequelize提供了 create 方法,该方法将上述的 build 方法和 save 方法合并为一个方法：
    let user = await leaderModelInstance.create(leaderModel);
    return user;
  }

  // 给具体某个 leader 添加关联任务表
  @post('/leaderAddTask')
  async leaderAddTask(ctx: any) {
    //   {
    //     "leaderId": "9bf0e276-9cf8-466a-8c70-c621dc836e5d",
    //     "taskName": "测试任务062",
    //     "level": "3"
    // }
    const { leaderId, taskName, level } = ctx.request.body;
    if (!leaderId) {
      throw new Error("leaderId is not null");
    }

    let leaderItem = await leaderModelInstance.findOne({
      where: {
        id: leaderId
      }
    })
    logUtils.warn('leaderItem MSG-------', leaderItem.toJSON())

    let tempTask = {
      leaderId: leaderId,
      taskName,
      level: level ? level : "1"
    }
    // 先新建，后做插入关联（插入的时候直接把 外键 key 值存储进去即可成功，并不一定要用 addXXX 方法）
    await taskModelInstance.create(tempTask);
    // let addRes = await leaderItem.addTask(taskItem);
    // console.log('addRes ------------- ', addRes.toJSON());

    // todo important: 一对多的时候注意配置方法后面加上 s ，如果设置了别名，此处方法名称也要换成别名的形式
    return leaderItem.getTasks()
  }

  @post('/loadUserAllTask')
  async loadUserAllTask() {
    const users = await leaderModelInstance.findAll({ include: taskModelInstance });
    console.log(JSON.stringify(users, null, 2));
    return users
  }

  /** 延迟加载示例 */
  @post('/loadSyncData')
  async loadSyncData(ctx: any) {
    // http://localhost:3300/AssociateController/loadSyncData?id=1b6fddad-f262-4219-8820-2f67ab25543d
    const { id } = ctx.request.query;
    if (!id) {
      logUtils.error("/AssociateController/loadSyncData---- id 值不能为空");
      return {
        errorCode: 7001,
        message: "id Params val is Null"
      }
    }
    // create 方法为 build 和 save 的结合 
    // Sequelize提供了 create 方法,该方法将上述的 build 方法和 save 方法合并为一个方法：
    let leaderItem = await leaderModelInstance.findOne({
      where: {
        id: id
      }
    });
    if (!leaderItem) {
      return {
        errorCode: 404,
        message: "leader not find"
      }
    }
    logUtils.warn("leaderItem Msg", leaderItem.toJSON());

    let taskRes = await leaderModelInstance.getTask();
    console.log('taskRes msg', taskRes.toJSON());
    return {
      taskMsg: taskRes,
      leaderItem
    }
  }

  /** 预先加载 */
  @post('/loadPreData')
  async loadPreData(ctx: any) {
    // http://localhost:3300/AssociateController/loadSyncData?id=1b6fddad-f262-4219-8820-2f67ab25543d
    const { id } = ctx.request.query;
    if (!id) {
      logUtils.error("/AssociateController/loadSyncData---- id 值不能为空");
      return {
        errorCode: 7001,
        message: "id Params val is Null"
      }
    }
    // create 方法为 build 和 save 的结合 
    // Sequelize提供了 create 方法,该方法将上述的 build 方法和 save 方法合并为一个方法：
    let leaderItem = await leaderModelInstance.findOne({
      where: {
        id: id
      },
      include: taskModelInstance
    });
    return leaderItem
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