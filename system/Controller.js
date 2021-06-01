// 引入路由
const router = require('koa-router')();


// 引入koa-body解析器(仅在post中使用)
// const bodyParser= require('koa-bodyparser');
// app.use(bodyParser());
const koaBody = require('koa-body');
// app.use(koaBody);


/* 
  解析控制器定义，生成路由映射
	request string: 在控制器中定义并导出的请求信息(必需包括请求方法和url，且以空格分隔)，如 "GET /product/:id"
	func
 */
const addRouter = (requestInfo, func)=>{
	
	// 将请求信息解析为：请求方法 和 url
	let reqInfo = requestInfo.split(" ");
	// console.log(reqInfo);return;
	
	// 检测路由定义
	if(!reqInfo[1]){
		console.log("控制器中[路由定义错误]："+requestInfo);
		return false;
	}
	
	
	switch(reqInfo[0].toUpperCase()){
		
		case 'GET':
			router.get(reqInfo[1], func);
			
		case 'POST':
			//post请求中使用koaBody 
			router.post(reqInfo[1], koaBody({multipart:true}), func);
			break;
			
		default:
			// 无效路由类型:
			console.error(`无效定义的控制器[路由方法]: ${requestInfo}`);
			break;
	}
	
}


/* 
 取得并解析控制器路由
 
 */
const getControllers = function(controllerDir){
	
	const path = require('path');
	// 默认控制器目录
	if(!controllerDir) controllerDir = path.resolve('./app/controllers')+"/";
	
	// 引入文件操作
	const fs = require('fs');
	
	// 同步读取控制器目录下的所有控制器文件
	let files = fs.readdirSync(controllerDir);
	
	// 过滤掉非js文件
	files = files.filter(f=>{
		return f.toLowerCase().endsWith('.js');
	});
	
	// 遍历控制器文件
	for(let f of files){
		
		// 载入控制器
		let ctlRouters = require(controllerDir+f);
		// console.log(ctlRouters);
		
		// 将控制器中的所有配置写入路由
		for(let requestInfo in ctlRouters){
			addRouter(requestInfo, ctlRouters[requestInfo]);
		}
		
	}
	
}

module.exports = (dir)=>{
	
	// console.log(path.resolve('./'),path.resolve(__dirname) );
	// return r=>r+1;	
	getControllers(dir);
	return router.routes();
}


/* 

// 解析控制器
// 同步读取控制器文件
const fs = require("fs");
let files = fs.readdirSync(__dirname + '/controllers');
console.log(files);

// 过滤掉非js文件
files = files.filter(f=>{
	return f.toLowerCase().endsWith('.js');
});

// console.log(files);

// 遍历控制器文件，并存储路由
for(let f of files){
	let routerMap = require(__dirname+'/controllers/'+f);
	
	for(let request in routerMap){
		let reqArr = request.split(' ');//request: GET /ctl/act/paramA
		
		// 取得请求类型
		let httpMethod = reqArr[0].toUpperCase();
		
		switch(httpMethod){
			case 'GET':
				router.get(reqArr[1], routerMap[request]);
				break;
				
			case 'POST':
				router.post(reqArr[1], routerMap[request]);
				break;
				
			default:
				// 无效路由类型:
				console.error(`invalid routeType: ${request}`);
				break;
		}
		
	}
	
}

 */


