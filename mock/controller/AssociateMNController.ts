/*
 * @Description: 测试 sequelize 中的关联关系接口 controller（此处为 M 对 N）
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
const teacherModelInstance = createModel('teacher', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // 或 Sequelize.UUIDV1
    primaryKey: true,       //主键
    // autoIncrement: true,    //自增
    comment: "自增id"       //注释:只在代码中有效
  },
  //名称 (教师名称)
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,   // 唯一键值
    // validate:{
    //   isEmail: true,   //类型检测,是否是邮箱格式
    // }
  },

  //年纪
  sex: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // 对字段增加自定义校验器，更多快捷校验方法可以参考项目中的 sequlize 文档
      customValidator(value: String) {
        if (value !== '0' && value !== '1') {
          throw new Error("性别字段赋值错误");
        }
      }
    }
  },

  // 教学内容
  teachContent: {
    type: DataTypes.STRING,
  }
});

// 创建 task model
const classModelInstance = createModel('classModel', {
  // id 主键
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // 或 Sequelize.UUIDV1
    primaryKey: true,       //主键
    // autoIncrement: true,    //自增
    comment: "自增id"       //注释:只在代码中有效
  },

  // 年级
  grade: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // 几班
  // tips：此处的大小写和数据库中是完全对应的，并不会转换成小写
  classNum: {
    type: DataTypes.STRING,
  }
});

// todo,尝试发现并没有自动创建第三方表，不知道是文档问题还是哪里配置问题，网络查询没发现相关问题，所以建议自己
// 手动创建第三方表做关联
// // 定义多对多关系 (通过 through 字段定义第三方的关联表，此时会自动创建，也可以自己定义第三方模型)
// teacherModelInstance.belongsToMany(classModelInstance, { through: 'TeacherClass' });
// classModelInstance.belongsToMany(teacherModelInstance, { through: 'TeacherClass' });

// 自己定义第三方模型
// tips：此处的表名在数据库中都会转换成小写
let associateMNInstance = createModel('Teacher_ClassExamp', {
  // id 主键
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4, // 或 Sequelize.UUIDV1
    primaryKey: true,       //主键
    allowNull: false,
    // autoIncrement: true,    //自增
    comment: "自增id"       //注释:只在代码中有效
  },

  // 关联teacherId 外键
  teacherId: {
    type: DataTypes.UUID,
    field: 't_id',    // 该字段配置可以手动做字段属性和表名映射
    allowNull: false
  },

  // 关联classId 外键
  classId: {
    type: DataTypes.UUID,
    // field: 't_id',    // 该字段配置可以手动做字段属性和表名映射
    allowNull: false
  }
})

// 手动创建第三方嵌套关联表并设置外键 // tips: 这里的外键要和字段属性匹配，不能和 field 字段映射的值匹配
teacherModelInstance.belongsToMany(classModelInstance, { through: associateMNInstance, foreignKey: 'teacherId' });
classModelInstance.belongsToMany(teacherModelInstance, { through: associateMNInstance, foreignKey: 'classId' });
// 超级多对多关联需要增加的部分，和第三方中间表做关联，这样可以使用多种查询和预先加载
teacherModelInstance.hasMany(associateMNInstance);
associateMNInstance.belongsTo(teacherModelInstance);

classModelInstance.hasMany(associateMNInstance);
associateMNInstance.belongsTo(classModelInstance);


// 教师 model，一个教师可以有多个班级，一个班级也可以有多个教师
export interface ITeacherModel {
  id: String,   // uuid key 值
  name: String,   // tips，有个问题，如何设置 ts 属性不可为空值
  sex: '0' | '1',   // 性别字段，0表示女，1表示男
  teachContent: String,    // 教学内容
}

// 教师 model，一个教师可以有多个班级，一个班级也可以有多个教师
export interface IClassModek {
  id: String,   // uuid key 值
  grade: String,    // 几年级
  classNum: Number,   // 几班
}

/**
 * 用户相关 Controller，控制
 * @export
 * @class UserController
 */
@prefix('/AssociateMNController')
export default class UserController {

  /** 创建 Model 数据，该方法为分开插入，先插入分别独立的数据，之后在通过 addXXX 方法进行关联 */
  @post('/createModel')
  async createModel(ctx: any) {
    //   {
    //     "teacherNam": "jiwenjie2",
    //     "sex": "1",
    //     "teachContent": "计算机",
    //     "grade": "高三",
    //     "classNum": "9"
    // }
    const { teacherNam, sex, teachContent, grade, classNum } = ctx.request.body;

    let teacherData = await teacherModelInstance.create({
      name: teacherNam,
      sex,
      teachContent
    })

    let classData = await classModelInstance.create({
      grade,
      classNum
    })

    // 分开插入，先插入教师记录和班级记录后在做关联
    await teacherData.addClassModel(classData);

    let res = await teacherModelInstance.findOne({
      where: {
        name: teacherNam
      },
      include: classModelInstance
    })

    return res;
  }

  // 添加关联表，一次性同时插入数据内容
  @post('/createModelAll')
  async createModelAll(ctx: any) {
    //   {
    //     "teacherNam": "jiwenjie4",
    //     "sex": "1",
    //     "teachContent": "计算机",
    //     "classList": [
    //         {
    //             "grade": "高一",
    //             "classNum": "3"
    //         },
    //         {
    //             "grade": "高一",
    //             "classNum": "5"
    //         },
    //         {
    //             "grade": "高二",
    //             "classNum": "8"
    //         },
    //         {
    //             "grade": "高三",
    //             "classNum": "9"
    //         }
    //     ]
    // }
    const { teacherNam, sex, teachContent, classList } = ctx.request.body;

    await teacherModelInstance.create({
      name: teacherNam,
      sex,
      teachContent,
      classModels: classList    // 此处类型是数组格式，对象是具体的 classModel 表的字段对应
    }, {
      include: classModelInstance
    });

    let result = await teacherModelInstance.findOne({
      where: {
        name: teacherNam
      },
      include: classModelInstance
    })

    return result
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