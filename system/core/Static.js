const fs = require("fs/promises");
const path = require('path')
const mime = require('mime');

//定义静态目录
module.exports = (staticDir='public')=>{

	return async (ctx, next)=>{
		// console.log('第1个中间件：static!');
		
		let filePath = path.resolve(staticDir+ctx.request.path);

		// 说明：静态资源在try中处理，返回后停止影响
		try{
			// 读取：如果出错，则由catch处理
			let file = await fs.readFile(filePath);

			//mime.getType根据后缀名判断mime类型并输出，注意文件不一定必需存在
			ctx.response.type = mime.getType(ctx.request.path);

			// 输出文件
			ctx.response.body = file;
		}

		// 说明：url不存在，则交由catch，转给框架处理。
		catch(err){
			// 加载框架基础数据到ctx.state
			const state = require(path.resolve('config.js'));//环境变量
			state.docRoot = path.resolve();//根目录，默认最后无/,
			for(let k in state){ctx.state[k] = state[k];}

			// 框架页面交给后面进行处理
			await next();
		}

	}
}
