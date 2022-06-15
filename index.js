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


	// 8. 启动侦听
	const port = $hw.PORT;
	app.listen(port);
	console.log(`app started: 0.0.0.0:${port}`);

})();













/* 

app.use(async (ctx, next) => {
    console.log(`0000 ${ctx.request.method} ${ctx.request.url}`); // 打印URL
    await next(); // 调用下一个middleware
		 console.log(`4444`);
});

app.use(async (ctx, next) => {
    const start = new Date().getTime(); // 当前时间
		console.log(`111`);
    await next(); // 调用下一个middleware
		console.log(`2222`);
    const ms = new Date().getTime() - start; // 耗费时间
    console.log(`3333 Time: ${ms}ms`); // 打印耗费时间
});

app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});




 */









// const router = require("./route.js");
// import router from "./route.js";
// console.log(router);

/* 
// 路由守卫
app.use(async (rtx, next)=>{
	
	console.log('路由拦截');
	
	await next();
});

// 载入路由
app.use(router.routes());

// 启动侦听
app.listen(5000);

console.log('app started: 127.0.0.1:5000');



 */