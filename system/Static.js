const fs = require("mz/fs");//fs-promise
const path = require('path')
const mime = require('mime');

module.exports = (staticDir)=>{
	
	// 定义静态目录
	if(!staticDir) staticDir='public';
	
	return async (ctx, next)=>{
		// 请求路径path
		let reqPath = ctx.request.path;
		// console.log(reqPath);
		
		// 当前请求文件的路径
		// console.log(ctx.state.docRoot, staticDir, reqPath);
		let filePath = path.join(ctx.state.docRoot, staticDir, reqPath);
		
		// 是文件则加载，否则由后续路由解析
		try{
			// 查找文件的mime
			ctx.response.type = mime.getType(reqPath);//mime.getType根据后缀名判断mime类型并输出，注意文件不一定必需存在
			
			// 读取文件内容并赋值给response.body
			ctx.response.body = await fs.readFile(filePath); 
			
		}
		catch(e){
			console.log('文件不存在，以路由解析');
			await next();
			// ctx.state.logger().error('静态资源错误: '+e);
		}	
		
	}
}



