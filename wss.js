(function(){

const { WebSocketServer } = require("ws");
const {success, fail} = require("./system/core/Rtn.js");



// 开启服务
const wss = new WebSocketServer({
  port:8888,
});

// 侦听
wss.on('connection', ws=>{

  ws.send( success('', 'welcome to ChyWss').stringify() );

  ws.on('message', bufferMsg=>{

    let rev = JSON.parse(bufferMsg.toString());
    // console.log('收到信息：', rev);

    // 辅助数据
    if(rev.group==0){
      console.log(rev.msg);
      // ws.send( success('').stringify() );
    }

    // 正常数据
    if(rev.group==1){

      let wd = rev.msg.trim();
      replay(wd).then(r=>{
        if(!r) throw new Error('没有与['+wd+']对应的结果！');
        ws.send(success(r).stringify());
      }).catch(e=>{
        ws.send(fail(e.toString()).stringify());
      })

    }

  });

});


})();

// 查词返回结果
async function replay(kw){
  const {select} = require("./system/library/Db");
  let r = await select('select * from t_dict where en=?', [kw], 1);
  // console.log(r);
  return r;
}



