/** 
 * 系统错误处理
 * 使用注意：所有页面必需有内容输出，否则将为404
 * 日志原则：前端均提示有错。调试：日志+控制台，生产：日志
 * 
 * 更新：修正之前后台的错误记录不全的问题，修改后为截取到一个换行符 20210811
 */

// 错误页：中间件
module.exports.errPages = async (ctx, next)=>{
	// console.log('第2个中间件[后置]：error!');	

	try{
		// 先执行后需内容，后判断错误
		await next();		
		// console.log(ctx.response);

		// if(ctx.response.status>=300) {// 注：此处为 大于2xx的均为异常
		if(!ctx.body) {// 没有内容被返回均为404
			ctx.response.status = 404;
			// ctx.state.logger().warn('[404] '+ctx.request.path);//日志
			// ctx.response.body = '404, 受访页面不存在';//简洁404
			await ctx.render('hiwork/epage', {code:404, message: "受访页面不存在"});
		}
		
	}
	
	// 出现错误
	catch(e){
		ctx.response.status = 500;
		
		//1. 记录日志
		const logger = require(ctx.state.docRoot+"/system/core/Logger.js");
		logger.error(
			'[500] '+ e.stack.substr(0, e.stack.search(/\r?\n/) || 300) 
		);
		// console.log(e.stack);//如上面日志记录有误，请通过此行查看
		
		//2. 显示错误页面
		// ctx.body = '500，内部服务器错误 '+e.toString();
		await ctx.render('hiwork/epage', {
			code:500, 
			message: ctx.state.modeType=='develop' ? e.toString() : "内部服务器错误"
		});
	}
	
} 






