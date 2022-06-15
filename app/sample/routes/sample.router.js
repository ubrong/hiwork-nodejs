const path = require('path');
const {router} = require(path.resolve('system/core/Route'));

/**
 * 本文件展示：具体项目路由的使用
 * 
 * 示例1：展示视图加载和在视图中使用语法案例
 * 示例2：商品列表
 * 示例3：单个商品
 * 
 * chy 20220504114142
 */


//1. 调用项目视图
router.get('/sample', async (ctx, next) => {
	
	await ctx.render('sample/index', {
		title:'我是页面标题内容',
		nick:'李雷',
		rows:[
			{title:'标题一', time:'15:53'},
			{title:'标题二', time:'12:48'},
			{title:'标题三', time:'14:22'},
			{title:'标题四', time:'09:31'},
		]
	});

});


//2. 调用数据库查询与商品视图 （商品列表页面）
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



//3. 调用数据库查询与商品视图+正则路由 （单个商品展示页面）
// router.get(/^\/goods\/(\d{2,5})(\.html)?$/, async (ctx, next)=>{})
router.get('/goods/(\\d{2,5})(\.html)?', async (ctx, next) => {

	// 取得商品id
	let nid = Number(ctx.params[0]);

	// 取回传入参数(非必需)：uri
	let uri = ctx.query.uri || '/goods/';

	// 查询商品信息
	const rowObj=await ctx.DB.select('select * from t_tb_goods where id=?', [nid], 1);

	// ctx.body = rowObj; return;
	await ctx.render('sample/good', {
		rowObj,
		uri,
	});

});


// == 项目表单应用展示 ==========================

// 表单主页面
router.get('/form/index.html', async (ctx, next) => {
	await ctx.render('sample/form');
});


// 增加一条, 后台[post请求]
router.post('/form/add', async (ctx, next) => {

	// 取得post数据
	let {email, phone, password} = ctx.request.body;

	// 写入数据库
	let res = await ctx.DB.insert ('chy.t_cs_user', {email, phone, password});

	// 返回结果
	res.affected==1 
		?  $rtn(ctx).success(res)
		:  $rtn(ctx).fail('添加失败');
	
});


// 读取列表（多条）, 后台[get请求]
router.get('/form/list', async (ctx, next) => {

	// 写入数据库
	let r = await ctx.DB.select('select * from chy.t_cs_user order by id desc limit ?;', [10]);

	 $rtn(ctx).success(r);
});


// 更新一条, 后台[put请求]
router.put('/form/update', async (ctx, next) => {

	// 取待更新数据
	let pdata = ctx.request.body;
	delete pdata.ctime;

	// 写入数据库 
	let res = await ctx.DB.update('chy.t_cs_user', pdata, ['id']);

	if(res==false)
		 $rtn(ctx).fail(res.getErr());
	else{
		if(res.affected<1)
			 $rtn(ctx).fail('更新失败');
		else if(res.changed<1)
			 $rtn(ctx).fail('没有数据被更新（可能是新旧数据一样）');
		else
			 $rtn(ctx).success();
	}
});


// 删除一条, 后台[delete请求]
// router.delete(/^\/form\/del\/(\d{1,5})$/, async (ctx, next) => {
router.delete('/form/del/(\\d{1,5})(\.html)?', async (ctx, next) => {
    let id=ctx.params[0];
	let res = ctx.DB.del('chy.t_cs_user', {id});

	res==false
		?  $rtn(ctx).fail(r.getErr())
		:  $rtn(ctx).success();
});



// redis操作案例
router.get('/redis(\.html)?', async function(ctx, next){

  const redis = require( path.resolve('system/library/Redis.js') );

  // 连接服务器
  await redis.connect();

  // 取值
  let age = await redis.get('age');
  await redis.set('age', ++age);//增加1

  // 关闭连接
  redis.quit();

  // 返回结果
   $rtn(ctx).success('取值[age]: ' + age);
});

