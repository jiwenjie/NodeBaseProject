/*
 * @Description: Socket 方法路径部分
 * @Author: 吉文杰
 * @Date: 2021-12-07 09:46:46
 * @LastEditors: 吉文杰
 * @LastEditTime: 2021-12-07 17:31:24 
 */
let WS = require("ws");
import logUtils from './logger';

export function initWebSocket(debug: Boolean = false, port: Number = 8088, callBack?: Function): any {
    if (debug) {
        logUtils.error('initWebSocket debug mode，do not open WebSocket');
        return;
    }
    let server = new WS.Server({ port: port });
    // 开启连接
    server.on("open", () => {
        logUtils.error('initWebSocket open success');
    })

    // 关闭连接
    server.on("close", (code: any, reason: any) => {
        logUtils.error('initWebSocket close -- code=' + code, + '--- reason=' + reason);
    })

    // 关闭连接(error 事件)
    server.on("error", (error: any) => {
        logUtils.error('initWebSocket error -- error reason=' + error);
        throw new Error("webSocket connect error, errorMsg is" + error);
    })

    // ping 事件 收到 ping 消息时发出，data为 Buffer 类型
    server.on("ping", (data: any) => {
        logUtils.error('initWebSocket ping -- data=' + data);
    })

    // pong 事件，收到 pong 消息时发出，data 为 Buffer 类型
    server.on("pong", (data: any) => {
        logUtils.error('initWebSocket pong -- data=' + data);
    })

    server.on('connection', (ws: any, req: any) => {
        // 把消息回调到 callBack 函数中
        callBack && callBack(ws, req);
        // console.log('ws', ws, 'type ws')
        // console.log('req', req, 'type msg')
        const ip = req.connection.remoteAddress;
        const port = req.connection.remotePort;
        const clientName = ip + port;
        console.log('clientName -----------', clientName)
        console.log('%s is connected', clientName)
        // 发送欢迎信息给客户端
        ws.send("Welcome ");
        ws.on('message', (message: any) => {
            console.log('received: %s from %s', message, clientName);
            // 广播消息给所有客户端
            server.clients.forEach((client: any) => {
                if (client.readyState === WS.OPEN) {
                    client.send(clientName + " -> " + message);
                }
            });
        });
    })

    return server;
}