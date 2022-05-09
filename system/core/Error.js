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
	
	// 判断是否是json请求
	let isJsonRequest = ctx.response.is('json');
	// ctx.LOG().info(isJsonRequest, ctx.url);

	try{
		// 先执行后需内容，后判断错误
		await next();		

		// 1. 记录访问日志
		if(ctx.ENV.ACCESS_LOG=='1'){//访问日志
			ctx.LOG('access').info(ctx.response.status, {
				uri:ctx.href,//originalUrl
				ip:ctx.ip,
				time: (new Date).toLocaleString(),
			});
		}


		// 2. 处理页面
		if(ctx.response.status==200){
			// 200则为成功页面
		}

		/* 
		  关于koa的返回：
			koa默认返回404（无status，无body）
			有body，无status，则状态码为200
			无body，有status，则body为OK		
			警告：下面对404的判断，不代表最终返回404，如有内容则变为200，所以有内容输出时必需指定为404	
		*/
		else if(ctx.response.status==404) {
			
			// 无错误：仅是未匹配到路由时为404
			if(isJsonRequest){
				ctx.RTN.fail("受访页面不存在999", [], 404);//
			}
			else{
				ctx.status = 404;
				await ctx.render('hiwork/epage-product', {
					code:404, 
					message: "受访页面不存在"
				});
			}		
		}
		else{
			// 非正常的状态码（但无错误产生），也不做处理
			//提示：其它情况：不是200，不是404，均按自已的方式处理
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
		let errText = getLogErrorTxt(e);

		if(ctx.ENV.ERROR_LOG=='1'){//错误日志
			ctx.LOG('error').error(errText,{
				status:ctx.status,
				uri:ctx.href,//originalUrl
				ip:ctx.ip,
				time: (new Date).toLocaleString(),
			});
		}
		
		//2. 显示错误页面 
		if(ctx.ENV.DEBUG_INFO=='1'){ 
			if(isJsonRequest){
				ctx.RTN.fail(errText);
			}
			else{
				e.emsg = e.stack;//加错误栈
				await ctx.render('hiwork/epage-develop', {
					status:ctx.response.status, 
					error:e
				});
			}
		}
		else{
			if(isJsonRequest){
				ctx.RTN.fail('系统报错, 请联系管理员解决');
			}
			else{
				await ctx.render('hiwork/epage-product', {
					code:ctx.response.status, 
					message: "系统报错",
					advice: "请联系管理员解决",
				});
			}
		}
	
	}
	
} 






