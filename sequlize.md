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