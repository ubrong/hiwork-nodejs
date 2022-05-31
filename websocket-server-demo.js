/* 
 * 普通WSS测试服务
 * 对 WSServer.js 的普通封装
 * 20220530173850
 * 
 */

const {WSServer} = require("./system/library/WSServer.js");

const port=8000;//服务端口
const noAuth = true;//是否验证用户
let wss = new WSServer(8000, noAuth);

console.log('WSServer 已启动：localhost:'+port);

