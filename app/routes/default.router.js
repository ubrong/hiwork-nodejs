const path = require('path');
const router = require(path.resolve('system/core/Route')).router;


// index
router.get('/', async (ctx, next) => {
  
  // 中间件（注意：控制器函数作为最后一个调用，中间件不是必需的）
	await next();
		
	// 输出一个普通文本
	// ctx.body = 'this is index'+(new Date).toLocaleString();
	// ctx.state.body.html('this is index'); //return;
	
	// 以模版输出html
	await ctx.render('hiwork/index', {title:'HiWork-NodeJs FrameWork'});

});



//抛出错误
router.get('/throwErr', async function(ctx, next){

	// 抛出错误（推荐）
	ctx.throw(400, 'age required', { username: 'abc' });

	// 错误断言(执行后，再判断后抛出， 推荐)
	// ctx.assert(ctx.state.uid, 401, '未找到用户id. 请先登陆后再使用!');

	// 普通抛出错误（简单，但错误信息不清晰，不推荐使用）
	// throw new Error('这是一个自定义的抛出错误！');

});


//json格式输出（成功）
router.get(
	/^\/json\/(success|fail)(\.html)?$/, 
	async function(ctx, next){

	// 取得输出类型：success|fail
	let rtnType = ctx.params[0];

	if(rtnType=='success'){
		ctx.state.body.success({name:'大刚', code:'100'});
		// ctx.state.rtn.success('请求成功', {name:'大航', code:'98'});//效果同上
	}
	else{
		ctx.state.body.fail('出现了一个错误！');
	}
});


//动态路由：路径参数
router.get('/user/:name', async function(ctx, next){
	let name = ctx.params.name;
	ctx.response.body = `<h1>Hello ${name}, welcome to HiWork!</h1>`
});


// 正则路由
router.get(/^\/news\/(\d{2,5})$/, async (ctx, next) => {
	// 这种情况无法将正则匹配到的结果绑定到变量
	let id = ctx.params[0];
	ctx.body = '当前的路径参数匹配(id)为：'+id;
});


// 几种非正常的页面，应避免如下用法
router.get('/debug', async (ctx, next) => {

	// 引入日志库（注意：如果不传入日志类别，将使用当前模式作为类别）
	const logger = require( path.resolve("system/core/Logger.js") )('debug');

	logger.info('chy note:', [
		'这是 ',
		(new Date).toLocaleString(), 
		'生成的一条debug信息', 
		'仅用于测试'
	]);

	ctx.body='<h1>请通过 控制台 和 debug日志文件 查看调试信息。</h1>';

});


// 几种非正常的页面，应避免如下用法
router.get('/mix', async (ctx, next) => {

	// ctx.body='all right!';//正常页面:有内容+200状态码

  ctx.response.status = 401;//打开一个信息不完整的异常页面+401状态码

	// await ctx.render('hiwork/epage-500.ejs');//打开一个信息不完整的错误页面，但状态码是200

});




