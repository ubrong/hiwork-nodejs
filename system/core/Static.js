const fs = require("fs/promises");
const path = require('path')
const mime = require('mime');


// 将基础数据push到state中
const pushInState = (_ctx)=>{

	// 加入根目录，默认最后无/,
	_ctx.state.docRoot = path.resolve();

	// 读取环境数据
	const _state = require(path.resolve('config.js'));//环境变量
	for(let k in _state){
		_ctx.state[k] = _state[k];
	}

	// 加入读取 library 的函数
	// _ctx.state.loadlib = libNameExt => require( path.resolve('system/library/'+libNameExt) );

	// 注意：logger返回是一个函数体，不要返回函数的执行结果（否则会造成多次创建实例）
	_ctx.state.logger = require( path.resolve('system/core/Logger.js') );
}

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

			// 注入state数据
			pushInState(ctx);
			
			// 框架页面交给后面进行处理
			await next();
		}

	}
}
