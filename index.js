(function(){
  
  // 1. 引入koa
  const koa = require("koa");
  const app = new koa();

  // 说明：各中间件 均应 `await next()`，以确保下个异步中间件可以执行
    
  // 2. 静态资源[第一个中间件: 普通页面则next]
  const static_ = require('./system/core/Static.js');
  app.use(static_('public'));// /public为公共资源目录
  
  // 3. 框架基础配置
  // const base = require("./system/core/Base.js");
  // app.use(base(app));
  require("./system/core/Base.js")(app);

  // 4. 载入koa视图中间件（必须在控制器之前, 在错误页前）
  const view = require('./system/core/View.js');
  app.use(view('views'));//koa-views插件，在此处不需要next

  // 5.错误页面（后置中间件，实际在控制器后执行）
  const error = require('./system/core/Error.js');
  app.use(error.errPages);


  // 6. 加载koa-body支持对post的解析
  const koaBody = require('koa-body');
  app.use(koaBody());


  // 测试用(前置)中间件
  // app.use(async (ctx, next)=>{
  // 	console.log( 'ceshi middleware ouput at : ' + (new Date()) );
  // 	// ctx.body='文档根：'+ctx.state.docRoot;
  // 	ctx.body='middleware output';
  // 	ctx.state.logger('default').info('这是一个测试logger的中间件');
  // 	await next();
  // })

  // 测试用(后置)中间件
  // app.use(async (ctx, next)=>{
  // 	await next();
  // 	console.log('后置中间件：'+ctx.body);
  // })


  // 7. 载入路由中间件（控制器路由是最后的中间件）
  const myrouter = require('./system/core/Route.js');
  app.use(myrouter.routes());

  // 8. 允许跨域
  const cors = require('koa2-cors');
  app.use(cors());

  // 8. 启动侦听
  const port = 8000//$hw.PORT;
  app.listen(port);
  console.log(`app started at: 0.0.0.0:${port}`);

})();
