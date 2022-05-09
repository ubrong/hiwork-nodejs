
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


// response+json格式，通用设置
// 注意：正常处理中的json均应为200状态码（非200的表示有错误发生）
const jsonHeader = (ctx, httpCode=200)=>{
  ctx.response.status = httpCode;//状态码
  ctx.set('Content-Type', 'application/json');
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set("Access-Control-Allow-Methods", 'GET,POST,PUT,DELETE');
}



module.exports = ctx=>{

  return {

    // json 成功
    success(msg="success", dt=[], httpCode=200){
      jsonHeader(ctx, httpCode);
  
      if(!ctx.body)
        ctx.body = success.apply(null, arguments);
    },
  
    // json 失败
    fail(msg="fail", data=[], httpCode=200){
      jsonHeader(ctx, httpCode);
  
      if(!ctx.body)
        ctx.body = fail.apply(null, arguments);
    },
  
    // html返回
    html(html, status=200){
  
      // 如有输出则不再输出
      if(!ctx.body){
        // 返回状态码：默认200
        ctx.response.status = status;

        // 警告：不设置'Content-Type'时，browser根据内容自动选择。这里强制为text/html型
        // ctx.type = 'text/plain; charset=utf-8';
        ctx.type = 'text/html; charset=utf-8';
        ctx.body = html || 'LUCK';
      }
  
    }
  
  };

}