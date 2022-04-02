/*
 * @Author: your name
 * @Date: 2021-12-11 13:18:45
 * @LastEditTime: 2021-12-11 13:24:26
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /htmlTemplete/Users/jiwenjie/Desktop/codeWorkSpace/VsCodeSpace/do-it-myself/NodeBaseProject/mock/mockdb/ModelUtils.ts
 */
import SequelizeInstance from "../mockdb/db";   // 导入数据库实例信息
// let { Sequelize, Model, DataTypes } = require('sequelize');

// modelOption 配置部分
// id: {
//     type: DataTypes.UUID,
//     defaultValue: Sequelize.UUIDV4, // 或 Sequelize.UUIDV1
//     primaryKey: true,       //主键
//     // autoIncrement: true,    //自增
//     comment: "自增id"       //注释:只在代码中有效
// },
// //用户名
// username: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,   // 唯一键值
//     // validate:{
//     //   isEmail: true,   //类型检测,是否是邮箱格式
//     // }
// },
// //密码
// pwd: {
//     type: DataTypes.STRING(255),
//     allowNull: false, //不允许为null
// },
// //昵称
// nickname: {
//     type: DataTypes.STRING
// },
// }
/**
 * @param modelName 用来配置 model 的名称，映射表名称
 * @param modelOption 用来配置 model 的字段属性，映射表里的字段
 * @param tableOption Model 创建表的属性，用来配置表中的其他属性
 * @param forceUpdate 判断是否强制更新表
 * */
export function createModel(modelName: String, modelOption: any, tableOption?: any, forceUpdate: Boolean = false): any {
    let modelInstance = SequelizeInstance.define(modelName, modelOption, {
        //使用自定义表名
        freezeTableName: true,  // 设置为 true 表示数据库中得实际表名就是 define 后定义得名称
        //去掉默认的添加时间和更新时间
        timestamps: false,
        ...tableOption
        // indexes:[
        //   //普通索引,默认BTREE
        //     {
        //         unique: true,
        //         fields: ['pid']
        //     },
        //  ]
    });
    // 判断是否强制更新表
    forceUpdate ? modelInstance.sync({ force: true }) : modelInstance.sync();
    // 同步: 没有就新建,有就不变 (创建完成之后就进行同步操作)
    // modelInstance.sync();
    // // 先删除后同步
    // modelInstance.sync({
    //   force: true
    // });
    return modelInstance;
}
