## 简介

项目的基础版本出自于源于花裤衩大佬的 vue-element-admin。

版本：

vue2+js版本：[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

vue2+ts版本：[vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template) 

vue3 发布之后，性能增强，速度vue2的倍数，打包体积都在减小（treeshaking），composition api 增加了项目可读性。

项目目的：
  - 保持技术的先进性，跟上技术发展
  - 作为公司定制组件的代码demo集合
  - 解决方案集合
  - 统一技术标准


## Mock

后台模拟服务器和其他版本不同，采用koa2+Faker进行模拟。

- [Koa2](https://github.com/koajs/koa)
- [Faker](https://github.com/Marak/faker.js)

启动mock server:

```shell
     "mock": "cd mock && ts-node-dev mock.ts"
```

mock在线地址：https://admin-tmpl-mock.rencaiyoujia.com/







