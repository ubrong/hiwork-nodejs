
// 错误页：中间件
module.exports.errPages = async (ctx, next)=>{
	try{
		// 执行后需内容
		await next();
		
		/* 
		console.log(ctx.response);
		类似如下错误:
		 {
		   status: 404,
		   message: 'Not Found',
		   header: [Object: null prototype] {},
		   body: undefined
		 }
		 */
		
		// if(ctx.response.status>=300) {// 注：此处为 大于2xx的均为异常
		if(!ctx.body) {// 接收所有没有内容被返回
			ctx.response.status = 404;
			// ctx.response.body = '404, 没有页面';
			ctx.state.logger().warn('[404] '+ctx.request.path);
			await ctx.render('hiwork/epage', {code:404, message: "受访页面不存在"});
		}
		
	}
	// 出现错误
	catch(e){
		
		// 日志记录
		ctx.state.logger().error('[500] '+ e.stack.substr(0, e.stack.lastIndexOf('^') || e.stack.length));
		// console.log('error捕获程序错误', e.stack);
		
		ctx.response.status = 500;
		// ctx.body = '500，内部服务器错误 '+e.toString();
		await ctx.render('hiwork/epage', {code:500, message: "内部服务器错误"});
	}
	
	
	
} 













