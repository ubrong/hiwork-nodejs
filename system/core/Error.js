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
		// console.log('=====>>>',ctx.response.status);
		if(ctx.response.status==200) return;

		// 说明：koa默认返回404（无status，无body）
		// 有body，无status，则状态码为200
		// 无body，有status，则body为OK
		if(ctx.response.status==404) {// 注：此处为 大于2xx的均为异常
		// if(!ctx.body) {// 没有内容被返回均为404
			await ctx.render('hiwork/epage-404', {code:404, message: "受访页面不存在"});
		}
		else{
			//有 非200 状态码，但没有出错的页面。
			await ctx.render('hiwork/epage-404', {
				code:ctx.response.status, 
				message: "非正常的状态码",
				advice: "请联系管理员，为什么要设置这个状态码？",
			});
		}
		
	}
	
	// 出现错误
	catch(e){
		// 抛出的错误有状态码的，则使用，否则为500
		ctx.response.status = e.status || 500;
		// console.log(JSON.stringify(e));

		// 定义日志错误的内容
		const getLogErrorTxt = errobj =>{

			let rtxt='捕获错误：';

			if(errobj.msg)
				rtxt += JSON.stringify(errobj);

			if(e.stack)
				rtxt += e.stack.split(/\r?\n/).slice(0, 3).join('<br/>\r\n');

			return rtxt;
		}
		
		//1. 记录日志
		const logger = require("./Logger.js");
		logger.error(getLogErrorTxt(e));
		// console.log(e, e.stack);//如上面日志记录有误，请通过此行查看
		
		//2. 显示错误页面
		if(ctx.state.modeType=='develop'){
			e.emsg = e.stack;//加错误栈
			await ctx.render('hiwork/epage-500', {
				status:ctx.response.status, 
				error:e
			});
		}
		else{
			await ctx.render('hiwork/epage', {
				code: ctx.response.status, 
				message: "内部服务器错误"
			});
		}
		
	}
	
} 






