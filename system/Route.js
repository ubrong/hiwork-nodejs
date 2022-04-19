// 并发读取控制器文件

const fs = require('fs/promises');
const path = require('path');
let router = require('koa-router')();

// controllerDir为控制器目录（注意使用相对路径）
async function parseCtrollerToRouter(controllerDir){
	//1. 取得控制器目录
	controllerDir = path.resolve(controllerDir);

	//2. 读取控制器目录下的所有控制器文件
	let files = await fs.readdir(controllerDir);
	// .js结尾为合法控制器文件
	files = files.filter(f=>f.slice(-3).toLowerCase()=='.js');
	// console.log('controllers: ',files);

	//3. 将控制器中配置载入路由实例
	for(let f of files){
		require('../app/controllers/'+f);
	}
}

// 导出：路由实例（由各控制器将自已路由加入实例）
module.exports.router = router;

// 导出：路由配置，供koa中间件使用
// controllerDir为控制器目录（注意使用相对路径）
module.exports.routes = (controllerDir='app/controllers')=>{
	console.log('第6个中间件：ctl!');	
	parseCtrollerToRouter(controllerDir);
	return router.routes();
};



