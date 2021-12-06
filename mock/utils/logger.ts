/** 
 * @Description: 日志工具类
 * @Author: 吉文杰
 * @Date: 2021-11-20 09:46:46
 * @LastEditors: 吉文杰
 * @LastEditTime: 2021-11-21 17:31:24 
 */
import log4js from 'log4js'

const log = log4js.getLogger('default');
export const errlog = log4js.getLogger('err');
export default log
