//json格式返回的中间件


const success = function(msg="success", dt=[]){
	// console.log(arguments);
	let time = (new Date).getTime();
	
	return typeof arguments[0]=="object" 
		? {stat:1, msg:'success', time, data:arguments[0]}
		: {stat:1, msg, time, dt};
}

const fail = function(msg="fail", data=[]){
	
	let time = (new Date).getTime();
	
	return typeof arguments[0]=="object"
		? {stat:0, msg:'fail', time, data:arguments[0]}
		: {stat:0, msg, time, data};
}


const jsonHeader = (ctx)=>{
  // ctx.response.status = 200;//状态码
  ctx.set('Content-Type', 'application/json');
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set("Access-Control-Allow-Methods", 'GET,POST,PUT,DELETE');
}



module.exports = ()=>{

	return async (ctx, next)=>{

    ctx.state.body = {

      // json 成功
      success(msg="success", dt=[]){
        jsonHeader(ctx);
        ctx.body = success.apply(null, arguments);
      },

      // json 失败
      fail(msg="fail", data=[]){
        jsonHeader(ctx);
        ctx.body = fail.apply(null, arguments);
      },

      // html返回
      html(html, status=200){

        // 如有输出则不再输出
        if(!!ctx.body){
          console.log('已有输出，不能再次输出！！！');//后期转为logger记录
          return;
        }


        // 返回状态码：默认200
        ctx.response.status = status;
        ctx.set('Content-Type', 'text/html');
        ctx.body = html;
      }

    }

    // 执行下一个中间件
    await next();
  };

}