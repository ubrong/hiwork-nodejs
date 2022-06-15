const path = require('path');
const {router} = require(path.resolve('system/core/Route'));

/**
 * 展示框架基础路由定义示例
 * 20220609095823
 */

//1. 主页面
router.get('/', async (ctx, next) => {
  
  // 中间件（注意：控制器函数作为最后一个调用，中间件不是必需的）
	await next();
		
	// 输出一个普通文本
	// ctx.body = '这是主页'+(new Date).toLocaleString();
	// $rtn(ctx).html('这是主页'+(new Date).toLocaleString());
	
	// 以模版输出html
	await ctx.render('hiwork/index', {title:'HiWork-NodeJs FrameWork'});

});


//2. json格式输出
router.get(
	// /^\/json\/(success|fail)(\.html)?$/i, //原生正则，但有路由前缀时不能解析，推荐下面写法
	'/json/(success|fail)(\.html)?', 
	async function(ctx, next){

	// 取得输出类型：success|fail
	let rtnType = ctx.params[0];

	if(rtnType.toLowerCase()=='success')
		//  $rtn(ctx).success({name:'大刚', code:'100'});
		 $rtn(ctx).success('请求成功', {name:'大刚', code:'98'});//效果同上
	else
		 $rtn(ctx).fail('出现了一个错误！');
	
});


//3. 抛出错误
router.get('/throwErr', async function(ctx, next){

	// 抛出错误（推荐）
	ctx.throw(400, 'age required', { username: 'abc' });

	// 错误断言(执行后，再判断后抛出， 推荐)
	// ctx.assert(ctx.state.uid, 401, '未找到用户id. 请先登陆后再使用!');

	// 普通抛出错误（简单，但错误信息不清晰，不推荐使用）
	// throw new Error('这是一个自定义的抛出错误！');

});



//4. 动态路由：路径参数
router.get('/user/:name', async function(ctx, next){
	let name = ctx.params.name;
	 $rtn(ctx).html( `<h1>Hello ${name}, welcome to HiWork!</h1>` );
	 $rtn(ctx).html( `这个不会再输出` );
});


//5. 正则路由
// router.get(/^\/news\/(\d{2,5})$/, async (ctx, next) => {
router.get('/news/(\\d{2,5})', async (ctx, next) => {
    // 这种情况无法将正则匹配到的结果绑定到变量
	let id = ctx.params[0];
	ctx.body = '当前的路径参数匹配(id)为：'+id;
});


//6. 调用日志
router.get('/debug', async (ctx, next) => {

	// 引入日志库（注意：如果不传入日志类别，将使用当前模式作为类别）
	ctx.LOG('debug').info('hw note:', [
		'这是 ',
		(new Date).toLocaleString(), 
		'生成的一条console信息', 
		'仅用于测试'
	]);

	ctx.body='<h1>请通过 控制台 和 debug日志文件 查看调试信息。</h1>';
});


//7. 几种非正常的页面的用法与说明
router.get('/mix', async (ctx, next) => {

	// ctx.body='all right!';//正常页面:有内容+200状态码

	//打开一个信息不完整的异常页面+401状态码
  // ctx.response.status = 401;（不推荐使用）
	// ctx.response.body = '请登陆';//作为401的页面内容，否则为默认的“Unauthorized”
	// 建议用下面2种方式反回异常状态码页面：
	 $rtn(ctx).html('<H1>请登陆</H1>', 401);
	//  $rtn(ctx).fail('请登陆', [], 401); //json格式

	// await ctx.render('hiwork/epage-develop.ejs');//打开一个信息不完整的错误页面，但状态码是200

});




