**sequlize 部分内容基本用法**

> 基本数据类型(字符串)

```
DataTypes.STRING             // VARCHAR(255)
DataTypes.STRING(1234)       // VARCHAR(1234)
DataTypes.STRING.BINARY      // VARCHAR BINARY
DataTypes.TEXT               // TEXT
DataTypes.TEXT('tiny')       // TINYTEXT
DataTypes.CITEXT             // CITEXT          仅 PostgreSQL 和 SQLite.
DataTypes.TSVECTOR           // TSVECTOR        仅 PostgreSQL.
```

> 基本数据类型(布尔)
```
DataTypes.BOOLEAN            // TINYINT(1)
```

> 基本数据类型(数字)
```
DataTypes.INTEGER            // INTEGER
DataTypes.BIGINT             // BIGINT
DataTypes.BIGINT(11)         // BIGINT(11)

DataTypes.FLOAT              // FLOAT
DataTypes.FLOAT(11)          // FLOAT(11)
DataTypes.FLOAT(11, 10)      // FLOAT(11,10)

DataTypes.REAL               // REAL            仅 PostgreSQL.
DataTypes.REAL(11)           // REAL(11)        仅 PostgreSQL.
DataTypes.REAL(11, 12)       // REAL(11,12)     仅 PostgreSQL.

DataTypes.DOUBLE             // DOUBLE
DataTypes.DOUBLE(11)         // DOUBLE(11)
DataTypes.DOUBLE(11, 10)     // DOUBLE(11,10)

DataTypes.DECIMAL            // DECIMAL
DataTypes.DECIMAL(10, 2)     // DECIMAL(10,2)
```

> 基本数据类型(无符号和零填充整数 - 仅限于MySQL/MariaDB)

----在 MySQL 和 MariaDB 中,可以将数据类型INTEGER, BIGINT, FLOAT 和 DOUBLE 设置为无符号或零填充(或两者),如下所示：

```
DataTypes.INTEGER.UNSIGNED
DataTypes.INTEGER.ZEROFILL
DataTypes.INTEGER.UNSIGNED.ZEROFILL
// 你还可以指定大小,即INTEGER(10)而不是简单的INTEGER
// 同样适用于 BIGINT, FLOAT 和 DOUBLE
```

> 基本数据类型(日期)
```
DataTypes.DATE       // DATETIME 适用于 mysql / sqlite, 带时区的TIMESTAMP 适用于 postgres
DataTypes.DATE(6)    // DATETIME(6) 适用于 mysql 5.6.4+. 支持6位精度的小数秒
DataTypes.DATEONLY   // 不带时间的 DATE
```

> 基本数据类型(UUID)

对于 UUID,使用 DataTypes.UUID. 对于 PostgreSQL 和 SQLite,它会是 UUID 数据类型;对于 MySQL,它则变成CHAR(36). Sequelize 可以自动为这些字段生成 UUID,只需使用 Sequelize.UUIDV1 或 Sequelize.UUIDV4 作为默认值即可：

```
{
  type: DataTypes.UUID,
  defaultValue: Sequelize.UUIDV4 // 或 Sequelize.UUIDV1
}
```

**列参数**

```
const { Model, DataTypes, Deferrable } = require("sequelize");

class Foo extends Model {}
Foo.init({
  // 实例化将自动将 flag 设置为 true (如果未设置)
  flag: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

  // 日期的默认值 => 当前时间
  myDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

  // 将 allowNull 设置为 false 将为该列添加 NOT NULL,
  // 这意味着如果该列为 null,则在执行查询时将从数据库引发错误.
  // 如果要在查询数据库之前检查值是否不为 null,请查看下面的验证部分.
  title: { type: DataTypes.STRING, allowNull: false },

  // 创建两个具有相同值的对象将引发错误.
  // unique 属性可以是布尔值或字符串.
  // 如果为多个列提供相同的字符串,则它们将形成一个复合唯一键.
  uniqueOne: { type: DataTypes.STRING,  unique: 'compositeIndex' },
  uniqueTwo: { type: DataTypes.INTEGER, unique: 'compositeIndex' },

  // unique 属性是创建唯一约束的简写.
  someUnique: { type: DataTypes.STRING, unique: true },

  // 继续阅读有关主键的更多信息
  identifier: { type: DataTypes.STRING, primaryKey: true },

  // autoIncrement 可用于创建 auto_incrementing 整数列
  incrementMe: { type: DataTypes.INTEGER, autoIncrement: true },

  // 你可以通过 'field' 属性指定自定义列名称：
  fieldWithUnderscores: { type: DataTypes.STRING, field: 'field_with_underscores' },

  // 可以创建外键：
  bar_id: {
    type: DataTypes.INTEGER,

    references: {
      // 这是对另一个模型的参考
      model: Bar,

      // 这是引用模型的列名
      key: 'id',

      // 使用 PostgreSQL,可以通过 Deferrable 类型声明何时检查外键约束.
      deferrable: Deferrable.INITIALLY_IMMEDIATE
      // 参数:
      // - `Deferrable.INITIALLY_IMMEDIATE` - 立即检查外键约束
      // - `Deferrable.INITIALLY_DEFERRED` - 将所有外键约束检查推迟到事务结束
      // - `Deferrable.NOT` - 完全不推迟检查(默认) - 这将不允许你动态更改事务中的规则
    }
  },

  // 注释只能添加到 MySQL,MariaDB,PostgreSQL 和 MSSQL 的列中
  commentMe: {
    type: DataTypes.INTEGER,
    comment: '这是带有注释的列'
  }
}, {
  sequelize,
  modelName: 'foo',

  // 在上面的属性中使用 `unique: true` 与在模型的参数中创建索引完全相同：
  indexes: [{ unique: true, fields: ['someUnique'] }]
});
```

> // Op 自包括得部分基础运算符
```
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

```

**1对1关联设置主键 (1对多关联设置主键同下)**
```
// 方法 1
Foo.hasOne(Bar, {
  foreignKey: 'myFooId'
});
Bar.belongsTo(Foo);

// 方法 2
Foo.hasOne(Bar, {
  foreignKey: {
    name: 'myFooId'
  }
});
Bar.belongsTo(Foo);

// 方法 3
Foo.hasOne(Bar);
Bar.belongsTo(Foo, {
  foreignKey: 'myFooId'
});

// 方法 4
Foo.hasOne(Bar);
Bar.belongsTo(Foo, {
  foreignKey: {
    name: 'myFooId'
  }
});
```

> 多对多关联(通过 through 关键字设置第三方关联表名称)
```
const Movie = sequelize.define('Movie', { name: DataTypes.STRING });
const Actor = sequelize.define('Actor', { name: DataTypes.STRING });
Movie.belongsToMany(Actor, { through: 'ActorMovies' });
Actor.belongsToMany(Movie, { through: 'ActorMovies' });
```

> 多对多关联也可以直接设置表模型
```
const Movie = sequelize.define('Movie', { name: DataTypes.STRING });
const Actor = sequelize.define('Actor', { name: DataTypes.STRING });
const ActorMovies = sequelize.define('ActorMovies', {
  MovieId: {
    type: DataTypes.INTEGER,
    references: {
      model: Movie, // 'Movies' 也可以使用
      key: 'id'
    }
  },
  ActorId: {
    type: DataTypes.INTEGER,
    references: {
      model: Actor, // 'Actors' 也可以使用
      key: 'id'
    }
  }
});
Movie.belongsToMany(Actor, { through: ActorMovies });
Actor.belongsToMany(Movie, { through: ActorMovies });
```

*与一对一和一对多关系不同,对于多对多关系,ON UPDATE 和 ON DELETE 的默认值为 CASCADE.当模型中不存在主键时，Belongs-to-Many 将创建一个唯一键. 可以使用 uniqueKey 参数覆盖此唯一键名. 若不希望产生唯一键, 可以使用 unique: false 参数*

**belongsTo和hasOne、hasMany等添加到实例上的方法**
```
来自 Foo.hasOne(Bar) 的相同内容:

fooInstance.getBar()
fooInstance.setBar()
fooInstance.createBar()
Foo.hasMany(Bar)#
fooInstance.getBars()
fooInstance.countBars()
fooInstance.hasBar()
fooInstance.hasBars()
fooInstance.setBars()
fooInstance.addBar()
fooInstance.addBars()
fooInstance.removeBar()
fooInstance.removeBars()
fooInstance.createBar()
示例:

const foo = await Foo.create({ name: 'the-foo' });
const bar1 = await Bar.create({ name: 'some-bar' });
const bar2 = await Bar.create({ name: 'another-bar' });
console.log(await foo.getBars()); // []
console.log(await foo.countBars()); // 0
console.log(await foo.hasBar(bar1)); // false
await foo.addBars([bar1, bar2]);
console.log(await foo.countBars()); // 2
await foo.addBar(bar1);
console.log(await foo.countBars()); // 2
console.log(await foo.hasBar(bar1)); // true
await foo.removeBar(bar2);
console.log(await foo.countBars()); // 1
await foo.createBar({ name: 'yet-another-bar' });
console.log(await foo.countBars()); // 2
await foo.setBars([]); // 取消关联所有先前关联的 Bars
console.log(await foo.countBars()); // 0


Foo.belongsToMany(Bar, { through: Baz })#
来自 Foo.hasMany(Bar) 的相同内容:

fooInstance.getBars()
fooInstance.countBars()
fooInstance.hasBar()
fooInstance.hasBars()
fooInstance.setBars()
fooInstance.addBar()
fooInstance.addBars()
fooInstance.removeBar()
fooInstance.removeBars()
fooInstance.createBar()
注意: 方法名称#
如上面的示例所示,Sequelize 赋予这些特殊方法的名称是由前缀(例如,get,add,set)和模型名称(首字母大写)组成的. 必要时,可以使用复数形式,例如在 fooInstance.setBars() 中. 同样,不规则复数也由 Sequelize 自动处理. 例如,Person 变成 People 或者 Hypothesis 变成 Hypotheses.

如果定义了别名,则将使用别名代替模型名称来形成方法名称. 例如：

Task.hasOne(User, { as: 'Author' });
taskInstance.getAuthor()
taskInstance.setAuthor()
taskInstance.createAuthor()
```

**验证器**
> 使用模型验证器,可以为模型的每个属性指定 格式/内容/继承 验证. 验证会自动在 create, update 和 save 时运行. 你还可以调用 validate() 来手动验证实例.
```
sequelize.define('foo', {
  bar: {
    type: DataTypes.STRING,
    validate: {
      is: /^[a-z]+$/i,          // 匹配这个 RegExp
      is: ["^[a-z]+$",'i'],     // 与上面相同,但是以字符串构造 RegExp
      not: /^[a-z]+$/i,         // 不匹配 RegExp
      not: ["^[a-z]+$",'i'],    // 与上面相同,但是以字符串构造 RegExp
      isEmail: true,            // 检查 email 格式 (foo@bar.com)
      isUrl: true,              // 检查 url 格式 (http://foo.com)
      isIP: true,               // 检查 IPv4 (129.89.23.1) 或 IPv6 格式
      isIPv4: true,             // 检查 IPv4 格式 (129.89.23.1)
      isIPv6: true,             // 检查 IPv6 格式
      isAlpha: true,            // 只允许字母
      isAlphanumeric: true,     // 将仅允许使用字母数字,因此 '_abc' 将失败
      isNumeric: true,          // 只允许数字
      isInt: true,              // 检查有效的整数
      isFloat: true,            // 检查有效的浮点数
      isDecimal: true,          // 检查任何数字
      isLowercase: true,        // 检查小写
      isUppercase: true,        // 检查大写
      notNull: true,            // 不允许为空
      isNull: true,             // 只允许为空
      notEmpty: true,           // 不允许空字符串
      equals: 'specific value', // 仅允许 'specific value'
      contains: 'foo',          // 强制特定子字符串
      notIn: [['foo', 'bar']],  // 检查值不是这些之一
      isIn: [['foo', 'bar']],   // 检查值是其中之一
      notContains: 'bar',       // 不允许特定的子字符串
      len: [2,10],              // 仅允许长度在2到10之间的值
      isUUID: 4,                // 只允许 uuid
      isDate: true,             // 只允许日期字符串
      isAfter: "2011-11-05",    // 仅允许特定日期之后的日期字符串
      isBefore: "2011-11-05",   // 仅允许特定日期之前的日期字符串
      max: 23,                  // 仅允许值 <= 23
      min: 23,                  // 仅允许值 >= 23
      isCreditCard: true,       // 检查有效的信用卡号

      // 自定义验证器的示例:
      isEven(value) {
        if (parseInt(value) % 2 !== 0) {
          throw new Error('Only even values are allowed!');
        }
      }
      
      isGreaterThanOtherField(value) {
        if (parseInt(value) <= parseInt(this.otherField)) {
          throw new Error('Bar must be greater than otherField.');
        }
      }
    }
  }
});
```

*allowNull 与其他验证器的交互*
如果将模型的特定字段设置为不允许为 null(使用 allowNull: false),并且该值已设置为 null,则将跳过所有验证器,并抛出 ValidationError.

另一方面,如果将其设置为允许 null(使用 allowNull: true),并且该值已设置为 null,则仅会跳过内置验证器,而自定义验证器仍将运行.

举例来说,这意味着你可以拥有一个字符串字段,该字段用于验证其长度在5到10个字符之间,但也允许使用 null (因为当该值为 null 时,长度验证器将被自动跳过)：
```
class User extends Model {}
User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [5, 10]
    }
  }
}, { sequelize });
你也可以使用自定义验证器有条件地允许 null 值,因为不会跳过它：

class User extends Model {}
User.init({
  age: Sequelize.INTEGER,
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      customValidator(value) {
        if (value === null && this.age !== 10) {
          throw new Error("除非年龄为10,否则名称不能为 null");
        }
      })
    }
  }
}, { sequelize });
你可以通过设置 notNull 验证器来自定义 allowNull 错误消息：

class User extends Model {}
User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: '请输入你的名字'
      }
    }
  }
}, { sequelize });
```
*模型范围内的验证*
还可以定义验证,来在特定于字段的验证器之后检查模型. 例如,使用此方法,可以确保既未设置 latitude 和 longitude,又未同时设置两者. 如果设置了一个但未设置另一个,则失败.

使用模型对象的上下文调用模型验证器方法,如果它们抛出错误,则认为失败,否则将通过. 这与自定义字段特定的验证器相同.

所收集的任何错误消息都将与字段验证错误一起放入验证结果对象中,其关键字以 validate 选项对象中验证方法失败的键命名. 即便在任何时候每种模型验证方法都只有一个错误消息,但它会在数组中显示为单个字符串错误,以最大程度地提高与字段错误的一致性.
```
一个例子:

class Place extends Model {}
Place.init({
  name: Sequelize.STRING,
  address: Sequelize.STRING,
  latitude: {
    type: DataTypes.INTEGER,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.INTEGER,
    validate: {
      min: -180,
      max: 180
    }
  },
}, {
  sequelize,
  validate: {
    bothCoordsOrNone() {
      if ((this.latitude === null) !== (this.longitude === null)) {
        throw new Error('Either both latitude and longitude, or neither!');
      }
    }
  }
})
在这种简单的情况下,如果只给定了纬度或经度,而不是同时给出两者, 则不能验证对象. 如果我们尝试构建一个超出范围的纬度且没有经度的对象,则somePlace.validate() 可能会返回：

{
  'latitude': ['Invalid number: latitude'],
  'bothCoordsOrNone': ['Either both latitude and longitude, or neither!']
}
也可以使用在单个属性上定义的自定义验证程序(例如 latitude 属性,通过检查 (value === null) !== (this.longitude === null) )来完成此类验证, 但模型范围内的验证方法更为简洁.
```

**多对多关系的优化使用**
让我们从 User 和 Profile 之间的多对多关系示例开始.
```
const User = sequelize.define('user', {
  username: DataTypes.STRING,
  points: DataTypes.INTEGER
}, { timestamps: false });
const Profile = sequelize.define('profile', {
  name: DataTypes.STRING
}, { timestamps: false });
```

定义多对多关系的最简单方法是 (此种方法测试没有自动生成中间表，不清楚是不是版本和配置的原因)
```
User.belongsToMany(Profile, { through: 'User_Profiles' });
Profile.belongsToMany(User, { through: 'User_Profiles' });
```

*我们还可以为自己定义一个模型,以用作联结表. 重点部分*

>tips: 注意此处只是官网示例文档，实际使用需要把外键字段等内容定义完全，可以惨开 AssociaMNController.ts 文件 
```
const User_Profile = sequelize.define('User_Profile', {}, { timestamps: false });
User.belongsToMany(Profile, { through: User_Profile });
Profile.belongsToMany(User, { through: User_Profile });
```

使用示例
```
const amidala = await User.create({ username: 'p4dm3', points: 1000 });
const queen = await Profile.create({ name: 'Queen' });
await amidala.addProfile(queen, { through: { selfGranted: false } });
const result = await User.findOne({
  where: { username: 'p4dm3' },
  include: Profile
});
console.log(result);
```
输出示例：
```
{
  "id": 4,
  "username": "p4dm3",
  "points": 1000,
  "profiles": [
    {
      "id": 6,
      "name": "queen",
      "User_Profile": {
        "userId": 4,
        "profileId": 6,
        "selfGranted": false
      }
    }
  ]
}
```

*你也可以在单个 create 调用中创建所有关系.*
> 即批量插入数据内容，已完成示例，可以参考 AssociateMNCOntroller.ts 文件
```
const amidala = await User.create({
  username: 'p4dm3',
  points: 1000,
  profiles: [{
    name: 'Queen',
    User_Profile: {
      selfGranted: true
    }
  }]
}, {
  include: Profile
});

const result = await User.findOne({
  where: { username: 'p4dm3' },
  include: Profile
});

console.log(result);
```

输出示例
```
{
  "id": 1,
  "username": "p4dm3",
  "points": 1000,
  "profiles": [
    {
      "id": 1,
      "name": "Queen",
      "User_Profile": {
        "selfGranted": true,
        "userId": 1,
        "profileId": 1
      }
    }
  ]
}
```

**联结表与普通表以及"超级多对多关联"**
*模型回顾 (有少量重命名)*
为了使事情更容易理解,让我们将 User_Profile 模型重命名为 grant. 请注意,所有操作均与以前相同. 我们的模型是：
```
const User = sequelize.define('user', {
  username: DataTypes.STRING,
  points: DataTypes.INTEGER
}, { timestamps: false });

const Profile = sequelize.define('profile', {
  name: DataTypes.STRING
}, { timestamps: false });

const Grant = sequelize.define('grant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  selfGranted: DataTypes.BOOLEAN
}, { timestamps: false });
```

我们使用 Grant 模型作为联结表在 User 和 Profile 之间建立了多对多关系：
```
User.belongsToMany(Profile, { through: Grant });
Profile.belongsToMany(User, { through: Grant });
```
这会自动将 userId 和 profileId 列添加到 Grant 模型中.

注意: 如上所示,我们选择强制 grant 模型具有单个主键(通常称为 id). 对于 超级多对多关系(即将定义),这是必需的.

**改用一对多关系**
除了建立上面定义的多对多关系之外,如果我们执行以下操作怎么办？
```
// 在 User 和 Grant 之间设置一对多关系
User.hasMany(Grant);
Grant.belongsTo(User);

// 在Profile 和 Grant 之间也设置一对多关系
Profile.hasMany(Grant);
Grant.belongsTo(Profile);
```

结果基本相同！ 这是因为 User.hasMany(Grant) 和 Profile.hasMany(Grant) 会分别自动将 userId 和 profileId 列添加到 Grant 中.

这表明一个多对多关系与两个一对多关系没有太大区别. 数据库中的表看起来相同.

唯一的区别是你尝试使用 Sequelize 执行预先加载时.

```
// 使用多对多方法,你可以:
User.findAll({ include: Profile });
Profile.findAll({ include: User });
// However, you can't do:
User.findAll({ include: Grant });
Profile.findAll({ include: Grant });
Grant.findAll({ include: User });
Grant.findAll({ include: Profile });

// 另一方面,通过双重一对多方法,你可以:
User.findAll({ include: Grant });
Profile.findAll({ include: Grant });
Grant.findAll({ include: User });
Grant.findAll({ include: Profile });
// However, you can't do:
User.findAll({ include: Profile });
Profile.findAll({ include: User });
// 尽管你可以使用嵌套 include 来模拟那些,如下所示:
User.findAll({
  include: {
    model: Grant,
    include: Profile
  }
}); // 这模拟了 `User.findAll({ include: Profile })`,
    // 但是生成的对象结构有些不同.
    // 原始结构的格式为 `user.profiles[].grant`,
    // 而模拟结构的格式为 `user.grants[].profiles[]`
```

**两全其美：超级多对多关系**
我们可以简单地组合上面显示的两种方法！
```
// 超级多对多关系
User.belongsToMany(Profile, { through: Grant });
Profile.belongsToMany(User, { through: Grant });
User.hasMany(Grant);
Grant.belongsTo(User);
Profile.hasMany(Grant);
Grant.belongsTo(Profile);
```

这样,我们可以进行各种预先加载：
```
// 全部可以使用:
User.findAll({ include: Profile });
Profile.findAll({ include: User });
User.findAll({ include: Grant });
Profile.findAll({ include: Grant });
Grant.findAll({ include: User });
Grant.findAll({ include: Profile });
```

我们甚至可以执行各种深层嵌套的 include：
```
User.findAll({
  include: [
    {
      model: Grant,
      include: [User, Profile]
    },
    {
      model: Profile,
      include: {
        model: User,
        include: {
          model: Grant,
          include: [User, Profile]
        }
      }
    }
  ]
});
```