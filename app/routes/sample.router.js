const path = require('path');
const router = require(path.resolve('system/core/Route')).router;

/* 
 * 示例1：展示视图加载和在视图中使用语法案例
 * 示例2：商品列表
 * 示例3：单个商品
 * chy 20220504114142
 */

//1. 视图组合示例
router.get('/sample', async (ctx, next) => {
	
	await ctx.render('sample/index', {
		title:'页面title文字',
		nick:'李雷',
		rows:[
			{title:'标题一', time:'15:53'},
			{title:'标题二', time:'12:48'},
			{title:'标题三', time:'14:22'},
			{title:'标题四', time:'09:31'},
		]
	});

});





//2. 示例：商品列表展示
router.get('/goods', async (ctx, next) => {

	// ctx.body = ctx;
	// return;

	// 引入db库（注意：要先配置数据库，并预先准备好数据）
	const db=require(path.resolve("system/library/Db.js"));
	
	//显示条数
	let show = (ctx.query.show>=1 && ctx.query.show<=100) 
	  ? Number(ctx.query.show) 
	  : 10;

	// 起始位置数
	let start = Math.floor(Math.random()*(100-50)+50);

	// 取数据
	let rows = await db.select('select * from t_tb_goods order by id desc limit ?,?', [start, show], 2);

	// 测试：sql出错
	// let rows = await db.select('select * from t_wy_goods6 order by id desc limit 20', [10], 2);

	// ctx.body = rows;//普通返回查询数据
	await ctx.render('sample/goods', {
		rows,
		uri:ctx.request.url,//记录当前uri
	});//模版显示

});



//3. 单个商品展示
//  get '/goods/(\d+):one'
router.get(/^\/goods\/(\d{2,5})(\.html)?$/, async (ctx, next) => {

	// 取得商品id
	let nid = Number(ctx.params[0]);

	// 取回传入参数：uri
	let uri = ctx.query.uri || '/goods/';

	// 查询商品信息
	const db=require(path.resolve("system/library/Db.js"));
	const rowObj=await db.select('select * from t_tb_goods where id=?', [nid], 1);

	// ctx.body = rowObj; return;
	await ctx.render('sample/good', {
		rowObj,
		uri,
	});

});



//1. 
router.get('/form', async (ctx, next) => {
	await ctx.render('sample/form');
});

// 增加
router.post('/form/add', async (ctx, next) => {

	// 取得post数据
	let {email, phone, password} = ctx.request.body;


	// 写入数据库
	const db=require(path.resolve("system/library/Db.js"));
	let r = await db.execute('insert chy.t_cs_user (email, phone, password) values(?,?,?);', [email, phone, password]);

	// console.log(r);
	ctx.state.logger('console').info('数据库处理结果：', r);
	

	// 返回结果
	// ctx.body = 'yes';
	r.matched>0 
		? ctx.state.body.success(r)
		: ctx.state.body.fail('添加失败');
	
});

// 读取
router.get('/form/list', async (ctx, next) => {

	// 写入数据库
	const db=require(path.resolve("system/library/Db.js"));
	let r = await db.select('select * from chy.t_cs_user order by id desc limit ?;', [10]);

	ctx.state.body.success(r);

});






