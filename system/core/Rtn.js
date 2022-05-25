class Rtn{

  code=0;//状态码 0：失败， 1：成功  x：其它自定义
  msg="";//说明文字
  time=Date.now();//当前时间戳
  data=[];//数据


  #rtn(msg, data, code){
    this.code = code;
    this.data = data;
    this.msg = msg;
    return this;
  }

  fail(msg="fail", data='', code=0){
    return this.#rtn.apply(this, arguments);
  }

  success(msg="success", data='', code=1){
    if(typeof(msg)=='object') [data, msg] = [msg, data];
    return this.#rtn.call(this, msg, data, code);
  }

  // 将当前实例字符串化
  stringify() {
    return JSON.stringify(this);
  }

}

const success = (msg="success", data='', code=1)=>{
  return (new Rtn).success(msg, data, code);
}

const fail = (msg="fail", data='', code=0)=>{
  return (new Rtn).fail(msg, data, code);
}



// response+json格式，通用设置
// 注意：正常处理中的json均应为200状态码（非200的表示有错误发生）
const jsonHeader = (ctx, httpCode=200)=>{
  ctx.response.status = httpCode;//状态码
  ctx.set('Content-Type', 'application/json');
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set("Access-Control-Allow-Methods", 'GET,POST,PUT,DELETE');
}



module.exports.success=success;
module.exports.fail=fail;
module.exports.rtn = ctx=>{

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