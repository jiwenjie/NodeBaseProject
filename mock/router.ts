/*
 * @Description: 路由工具类，读取 controller 文件夹下得文件，获取类装饰器路径和方法装饰器路径，拼接成完整得路由地址信息
 * @Author: 吉文杰
 * @Date: 2021-11-20 09:46:46
 * @LastEditors: 吉文杰
 * @LastEditTime: 2021-11-21 17:31:24 
 */
import 'reflect-metadata'
import fs from 'fs'
import path from 'path'
import { ROUTER_MAP, BASE_PATH_MAP } from './constant'
import { RouteMeta, PathMeta } from './type'
import Router from 'koa-router'

const addRouter = (router: Router) => {
  // join 方法描述 path.join():方法使用平台特定的分隔符把全部给定的 path 片段连接到一起，并规范化生成的路径。
  // example 例如：path.join('foo', 'baz', 'bar'); // 返回 'foo/baz/bar'
  const ctrPath = path.join(__dirname, 'controller');
  const modules: ObjectConstructor[] = [];
  // 扫描controller文件夹，收集所有controller
  fs.readdirSync(ctrPath).forEach(name => {
    if (/^[^.]+\.(t|j)s$/.test(name)) {
      modules.push(require(path.join(ctrPath, name)).default)
    }
  });

/***** path.resolve start  *****/
// path.resolve 方法的语法如下所示
// path.resolve([...paths])

// example ----- 使用示例如下
// console.log(path.resolve())           // returns /workspace/demo
// console.log(path.resolve(''))         // returns /workspace/demo
// console.log(path.resolve(__dirname))  // returns /workspace/demo
// console.log(path.resolve('/img/books', '/net'))   // returns '/net'
// console.log(path.resolve('img/books', '/net'))    // returns '/net'
// console.log(path.resolve('img/books', './net'))   // returns '/workspace/demo/img/books/net'
// console.log(path.resolve('/img/books', './net'))   // returns '/img/books/net'
// console.log(path.resolve('/img/books', 'net'))     // returns '/img/books/net'
// console.log(path.resolve('/img/books', '../net'))         // returns '/img/net'
// console.log(path.resolve('src','/img/books', '../net'))   // returns '/img/net'
// console.log(path.resolve('src','./img/books', '../net'))   // returns '/workspace/demo/src/img/net'
// console.log(path.resolve('src','img/books', '../net'))     // returns '/workspace/demo/src/img/net'

// Tips: Important ( 方法使用总结部分 )
// 总结一下：参数从后向前，若字符以 / 开头，不会拼接到前面的路径；若以 ../ 开头，
// 拼接前面的路径，但是不含前面一节的最后一层路径；若以 ./ 开头 或者没有符号 则拼接前面路径；


/***** path.join start  *****/
// 语法：path.join([...paths])

// 使用示例如下
// path.join('/img', 'book', 'net/abc', 'inter', '..');  // returns /img/book/net/abc
// console.log(path.join('/img/books', '../net'))    // returns /img/net
// console.log(path.join('img/books', '../net'))     // returns img/net
// console.log(path.join('/img/books', './net'))     // returns /img/books/net
// console.log(path.join('img/books', './net'))      // returns img/books/net
// console.log(path.join('/img/books', 'net'))       // returns /img/books/net
// console.log(path.join('img/books', 'net'))        // returns /img/books/net
// console.log(path.join('/img/books', '/net'))      // returns /img/books/net
// console.log(path.join('img/books', '/net'))       // returns img/books/net

// Tips：Important ( join 方法使用总结部分 )
// 总结一下 区别：join()只是拼接各个path片段，并不像resolve()一样除了拼接各个字段还拼接了工作目录的路径，
// 其次如果以/开头的字符串片段在join并不像resolve一样是只返回自身，还有就是.. 同 ../是一个意思都代表上一级目录

  // 结合meta数据添加路由 和 验证
  modules.forEach(mItem => {
    // console.log('modules item', mItem);

    const routerMap: RouteMeta[] = Reflect.getMetadata(ROUTER_MAP, mItem, 'method') || [];
    // console.log('routerMap--', routerMap);

    const basePathMap: PathMeta[] = Reflect.getMetadata(BASE_PATH_MAP, mItem) || [];
    // console.log('basePathMap--', basePathMap);

    const basePath: PathMeta = basePathMap.pop();
    // console.log('basePath--', basePath);  // 这里取得是 controller 中类名得 prex 前缀信息

    if (routerMap.length) {
      const ctr = new mItem();
      routerMap.forEach(route => {        
        // console.log('routerMap route item', route);
        // const {name, method, path, isVerify} = route;
        const { name, method, path } = route;
        const newPath: String = basePath ? (basePath.path + path) : path;
        // router[method](newPath, jwt(newPath, isVerify), ctr[name]);
        router[method](newPath, ctr[name]);
        // console.log('resolve router', newPath, ctr[name]);
      })
    }
  })
}

export default addRouter;