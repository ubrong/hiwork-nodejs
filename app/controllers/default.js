const path = require('path');
const router = require(path.resolve('system/core/Route')).router;


// get
router.get('/', async (ctx, next) => {
  
  // 中间件（注意：控制器函数作为最后一个调用，中间件不是必需的）
	await next();
	
	// 抛出错误
	// throw new Error('me error');
	
	// 输出一个普通文本
	// ctx.body = 'this is index';
	
	// 以模版输出html
	await ctx.render('index', {title:'HiWork-NodeJs FrameWork'});

});


//普通页面返回
router.get('/about', async function(ctx, next){
	// await next();//使用中间件
	// console.log(ctx.response);//查看返回的数据
	ctx.body = ' this is about page';
});



//路径参数
router.get('/user/:name', async function(ctx, next){
	let name = ctx.params.name;
	ctx.response.body = `<h1>Hello ${name}, welcome to HiWork!</h1>`
});


//路径参数
router.get('/err', async function(ctx, next){
  throw new Error('这是一个自定义的抛出错误！');
});


