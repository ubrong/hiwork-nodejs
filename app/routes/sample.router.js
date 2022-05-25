const path = require('path');
const {router} = require(path.resolve('system/core/Route'));

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
router.get('/goods/', async (ctx, next) => {
 	
	//显示条数
	let show = (ctx.query.show>=1 && ctx.query.show<=100) 
	  ? Number(ctx.query.show) 
	  : 10;

	// 起始位置数
	let start = Math.floor(Math.random()*(100-50)+50);

	// 取数据
	let rows = await ctx.DB.select('select * from t_tb_goods order by id desc limit ?,?', [start, show], 2);

	await ctx.render('sample/goods', {
		rows,
		uri:ctx.request.url,//记录当前uri
	});

});



//3. 单个商品展示
//  get '/goods/(\d+):one'
// router.get(/^\/goods\/(\d{2,5})(\.html)?$/, async (ctx, next) => {
router.get('/goods/(\\d{2,5})(\.html)?', async (ctx, next) => {

	// 取得商品id
	let nid = Number(ctx.params[0]);

	// 取回传入参数：uri
	let uri = ctx.query.uri || '/goods/';

	// 查询商品信息
	const rowObj=await ctx.DB.select('select * from t_tb_goods where id=?', [nid], 1);

	// ctx.body = rowObj; return;
	await ctx.render('sample/good', {
		rowObj,
		uri,
	});

});


router.get('/form/cs', async (ctx, next) => {
	await ctx.DB.insert ('xxx', {id:5, stat:1});
	ctx.body='yes'
});



// == 表单 =================================================
//显示表单主页面
router.get('/form/', async (ctx, next) => {
	await ctx.render('sample/form');
});


// 增加一条
router.post('/form/add', async (ctx, next) => {

	// 取得post数据
	let {email, phone, password} = ctx.request.body;

	// 写入数据库
	let res = await ctx.DB.insert ('chy.t_cs_user', {email, phone, password});

	// ctx.state.logger('console').info('数据库处理结果：', r);

	// 返回结果
	res.affected==1 
		? ctx.RTN.success(res)
		: ctx.RTN.fail('添加失败');
	
});


// 读取列表（多条）
router.get('/form/list', async (ctx, next) => {

	// 写入数据库
	let r = await ctx.DB.select('select * from chy.t_cs_user order by id desc limit ?;', [10]);

	// ctx.LOG().info('数据库处理结果：', r);

	ctx.RTN.success(r);
});


// 更新一条
router.put('/form/update', async (ctx, next) => {

	// 取待更新数据
	let pdata = ctx.request.body;
	delete pdata.ctime;

	// 写入数据库
	let res = await ctx.DB.update('chy.t_cs_user', pdata, ['id']);

	if(res==false)
		ctx.RTN.fail(res.getErr());
	else{
		if(res.affected<1)
			ctx.RTN.fail('更新失败');
		else if(res.changed<1)
			ctx.RTN.fail('没有数据被更新（可能是新旧数据一样）');
		else
			ctx.RTN.success();
	}
});


// 删除一条
router.delete(/^\/form\/del\/(\d{1,5})$/, async (ctx, next) => {
	let id=ctx.params[0];
	let res = ctx.DB.del('chy.t_cs_user', {id});

	res==false
		? ctx.RTN.fail(r.getErr())
		: ctx.RTN.success();
});


