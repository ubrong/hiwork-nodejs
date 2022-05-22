/* 
  完成框架系统基础数据和工具的构建
  20220509134527
 */


/* 
 @app koa实例
 return async function
 */
const path = require('path');

module.exports = (app)=>{
  // 第一部分：向 ctx原型 中添加数据

  // 1.1 log库
  app.context.LOG = require(path.resolve('system/core/Logger.js'));
  // 注意：logger返回是一个函数体，不要返回函数的执行结果（否则会造成多次创建实例）

  // 1.2 db库
  app.context.DB = require(path.resolve("system/library/Db.js"));

  // 1.3 项目根目录
  // app.context.pathResolve=path.resolve;

  // 1.4 环境变量数据
  let envObj = require("dotenv").config();
  app.context.ENV = envObj.parsed;

  // 第二部分：通过上下文 ctx 添加数据
  return async function(ctx, next){

    // 2.1 rtn库(要通过上下文写入原型)
    app.context.RTN = require(path.resolve('system/core/Rtn.js')).rtn(ctx);

    // 加入根目录，默认最后无/,
    // ctx.state.docRoot = path.resolve();

    await next();
  }
}

