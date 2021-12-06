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
let { Sequelize, Model, DataTypes } = require('sequelize');

// 创建用户 model
const users = SequelizeInstance.define('user', {
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
  freezeTableName: true,
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
users.sync();
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
  async createArticle(ctx: any) {
    const { username, pwd, nickname } = ctx.request.body;
    let userNodel = {
      username,
      pwd,
      nickname
    }
    // create 方法为 build 和 save 的结合 
    // Sequelize提供了 create 方法,该方法将上述的 build 方法和 save 方法合并为一个方法：
    let user = await users.create(userNodel);
    return {
      code: 200,
      data: {
        user
      }
    }
  }

  // @post('/articles')
  // async getArticles(ctx: any) {
  //   const { importance, type, title, page = 1, limit = 20, sort } = ctx.request.body
  //   let mockList = articleList.filter(item => {
  //     if (importance && item.importance !== +importance) return false
  //     if (type && item.type !== type) return false
  //     if (title && item.title.indexOf(title as string) < 0) return false
  //     return true
  //   })

  //   if (sort === '-id') {
  //     mockList = mockList.reverse()
  //   }
  //   const pageList = mockList.filter((_, index) => index < (limit as number) * (page as number) && index >= (limit as number) * (page as number - 1))
  //   return {
  //     total: mockList.length,
  //     items: pageList
  //   }
  // }

  // // http://localhost:3300/article/articleInfo
  @get('/userInfo')
  async getArticle(ctx: any) {
    logUtils.debug('userInfo -- ', ctx.query);
    const { id } = ctx.query
    
  }

  // @post('/updateArticle')
  // updateArticle(ctx: any) {
  //   const article  = ctx.request.body

  //   for (const v of articleList) {
  //     if (v.id.toString() == article.id) {
  //       return  article
  //     }
  //   }
  //   return {
  //     code: 70001,
  //     message: 'Article not found'
  //   }
  // }

  // @post('/deleteArticle')
  // deleteArticle(ctx: any) {
  //   console.log(ctx)
  //   return {
  //     code: 20000
  //   }
  // }
}
