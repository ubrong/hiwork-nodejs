/* 
 * WebSocket server 封装
 * 20220526105232
 * 

服务端处理流程：
  收到消息{type:"auth/common", data:"..."}  
    |
  (是否已认证) --是--> {success正常消息处理}
    |否
  (是否有auth标记) --是--> {auth认证：用户名和密码} --是--> {success:welcome信息}
    |否                            |否
  {fai:提示认证，累加次数}      {fai:提示用户名密码错误，累加次数}

服务端返回信息格式：
  {code:"0|1", data:"...", msg:"", time:123}
  success().stringify();
  fail().stringify();

 * 
 * 
 * 
 * 
 */


const { WebSocketServer } = require("ws");
const { success, fail } = require("../core/Rtn");

// 已登陆与任一客户端的连接信息
class WSInfo
{
  authed= false;
  count=1;
  maxCount= 3;
}

// WSServer 基类
class WSServer
{
  wss;

  constructor(port=8000, authed=false){

    // 开启wss服务
    this.wss = new WebSocketServer({port});

    // 绑定连接
    this.wss.on('connection', wsConnect=>{

      // 生成当前连接的信息（各线程间不冲突）
      let wsInfo = new WSInfo();
      wsInfo.authed = authed;

      // 消息回调
      wsConnect.on('message', bufferMsg=>{
        //0. 取回传入消息（转为名文）
        let revObj= this.convertReceiveMsg(bufferMsg);

        // 1. 是否认证过
        if(wsInfo.authed){
          // 1.1 已认证的处理
          // wsConnect.send( success('收到消息', revObj).stringify() );
          this.sendMsg(wsConnect, revObj);
        }
        else{
          //1.2 未认证的处理

          let emsg = '请进行用户登陆认证！';

          //1.2.1 认证操作
          if(revObj.type=='auth'){
            // 认证成功，则此流程停止
            if(this.authing(revObj.username, revObj.password)){
              wsInfo.authed = true;
              wsConnect.send( 
                success('Welcome to Wss at '+(new Date).toLocaleString()).stringify()
              );
              return;
            }

            emsg = '用户名 或 密码 错误！';
          }

          //1.2.2  认证失败 或 没有认证信息
          //1.2.2.1 大于验证次数则关闭连接
          if(wsInfo.count>=wsInfo.maxCount){
            wsConnect.send( 
              fail('认证错误次数超过3次，连接已关闭！', {type:'auth'}).stringify()
            );
            wsConnect.close();
          }

          //1.2.2.2 发送认证错误提示，并累积次数
          wsConnect.send( 
            fail(
              `第 ${wsInfo.count}/${wsInfo.maxCount} 次提示：`+emsg,
               {type:'auth'}).stringify() 
          );
          wsInfo.count++;

          
        }

      })
    })


  }

  // 将收到的消息转为名文（如果是json则转为对象）
  convertReceiveMsg(bufferMsg){

    let msg= bufferMsg.toString();//转为名文消息
    // console.log(msg);

    try{
      return JSON.parse(msg);
    }
    catch(e){
      return msg;
    }

  }


  // 发送消息(-->重写此方法<--)
  sendMsg(wsConnect, revMsgObj){
    wsConnect.send( success('收到消息', revMsgObj).stringify() );
  }


  
  /* 
   * 认证用户[-->重写此方法<--]
   * return boolean ture:已认证;false:认证失败
   * 20220526172408
   */
  authing(username, password){
    if(username=='abc' && password=='123456'){
      return true;
    }
    
    return false;
  }

}


module.exports.WSServer = WSServer