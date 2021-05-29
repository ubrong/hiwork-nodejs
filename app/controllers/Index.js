// 主页案例
const index = async function(ctx, next){
	
	// 中间件（注意：本函数作为最后一个调用，中间件不是必需的）
	await next();
	
	// 抛出错误
	// throw new Error('me error');
	
	// 输出一个普通文本
	// ctx.body = 'this is index';
	
	// 以模版输出html
	await ctx.render('index', {title:'HiWork-NodeJs FrameWork'});
	
}


//普通页面返回
const about = async function(ctx, next){
	
	// await next();//使用中间件
	// console.log(ctx.response);//查看返回的数据
	ctx.body = 'this is about page';
}


//数据库操作案例 
const goods = async function(ctx, next){
	
	// 引入db库（注意：要先配置数据库，并预先准备后数据）
	const db = require('Db.js');
	
	// 执行sql查询(从goods表中返回数据)
	let list = await db.query('select * from t_goods where id<10', [10]);
	// console.log(list);
	
	// ctx.body = list;//普通返回查询数据
	await ctx.render('goods',{list});//模版显示

	
}

module.exports = {
	'GET /': index,
	'GET /about': about,
	'GET /goods': goods,
	
}




