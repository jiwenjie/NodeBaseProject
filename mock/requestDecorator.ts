/* 
 * @Description: 装饰器工具类，完成路径类装饰器和方法装饰器
 * @Author: 吉文杰
 * @Date: 2021-11-20 09:46:46
 * @LastEditors: 吉文杰
 * @LastEditTime: 2021-11-21 17:31:24  
 * */
import 'reflect-metadata'
import { ROUTER_MAP, BASE_PATH_MAP } from './constant'

/**
 * @desc 生成 http method 装饰器
 * @param {string} method - http method，如 get、post、head
 * @return Decorator - 装饰器
 */
function createMethodDecorator(method: string) {
  // 装饰器接收路由 path 作为参数
  return function httpMethodDecorator(path: string) {
    // name 表示的是修饰的方法名称，descriptor 表示的是对象中的描述属性，即是否可编辑、可枚举、可修改
    //  descriptor: any 为第三个参数； descriptor 返回示例：{"writable":true,"enumerable":false,"configurable":true}
    /** 
     * @Params 装饰器第一个参数是 类的原型对象 、
     * @todo tips：装饰器的本意是要“装饰”类的实例，但是这个时候实例还没生成，
     *        所以只能去装饰原型（这不同于类的装饰，那种情况时target参数指的是类本身）；
     * @Params 第二个参数是 所要装饰的属性名 (即定义的方法名称)
     * @Params 第三个参数是 该属性的描述对象(此处省略该参数)
     */
    return (proto: any, name: string) => {
      // console.log('createMethodDecorator------- proto' + proto, " ===== name=" + name, " ===== descriptor=" + JSON.stringify(descriptor));
      // target Val 返回为  [class Article] 和 [class UserController] 这种格式，即表示的是当前类的构造函数
      const target = proto.constructor;
      // console.log('httpMethodDecorator ----------------- target Val', target)
      const routeMap = Reflect.getMetadata(ROUTER_MAP, target, 'method') || [];
      routeMap.push({ name, method, path });
      Reflect.defineMetadata(ROUTER_MAP, routeMap, target, 'method');
    };
  };
}

/**
 * 创建类路径装饰器
 * @param className
 */
function createClassDecorator() {
  // 装饰器接收路由 path 作为参数
  return function httpMethodDecorator(basePath: string): ClassDecorator {
    return (proto: any) => {
      // console.log('httpMethodDecorator--------proto=', proto)
      // target 的 值 为[class Article] 和 [class UserController]
      const target = proto;
      const pathMap = Reflect.getMetadata(BASE_PATH_MAP, target) || [];
      pathMap.push({ path: basePath });
      Reflect.defineMetadata(BASE_PATH_MAP, pathMap, target);
    };
  };
}

// 路径前缀
export const prefix = createClassDecorator()

// 导出 http method 装饰器
export const post = createMethodDecorator('post');

export const get = createMethodDecorator('get');

export const del = createMethodDecorator('del');

export const put = createMethodDecorator('put');

export const patch = createMethodDecorator('patch');

export const options = createMethodDecorator('options');

export const head = createMethodDecorator('head');

export const all = createMethodDecorator('all');