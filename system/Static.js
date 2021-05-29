const fs = require("mz/fs");//fs-promise
const path = require('path')
const mime = require('mime');
// const base = require('./base');

module.exports = (staticDir)=>{
	
// 定义静态目录
	if(!staticDir) staticDir='/static/';
	
	return async (ctx, next)=>{
		// 请求路径path
		let reqPath = ctx.request.path;
		// console.log(reqPath);
		 
		// 非静资源解析,并停止后续中间件
		if(reqPath.startsWith(staticDir)){
			// 合成文件完整路径
			// ctx.state.docRoot
			let filepath = path.join(ctx.state.docRoot, reqPath);
			// console.log(filepath);
			
			try{
				// 查找文件的mime
				ctx.response.type = mime.getType(reqPath);
				// 读取文件内容并赋值给response.body
				ctx.response.body = await fs.readFile(filepath); 
				
			}
			catch(e){
				// 注意：此处只要没有body的输出，后面error均可以以错误接收
				// console.log('静态资源错误: ', e);
				// ctx.response.body = e;
				ctx.state.logger().error('静态资源错误: '+e);
			}


/* 
			// 文件存在与否
			if(await fs.exists(filepath)){
				// console.log('存在');
				// 查找文件的mime
				ctx.response.type = mime.getType(reqPath);
				// 读取文件内容并赋值给response.body
				ctx.response.body = await fs.readFile(filepath); 
			}
			else{
				console.log('静态资源不存在');
				// throw new Error(404);
				
				ctx.response.status  = 404;
				ctx.body = 'not found!';
			}
*/			
			
			 
		}
		
		// 非静态资源, 进入一下中间件
		else{
			await next();
		}
		
		
		
		
	}
}



