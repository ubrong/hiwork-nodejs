const {createClient} = require('redis');
const {resolve}  = require('path');  
/* 
 * Redis客户端工具库
 * 
 * 
 * 使用示例
    const redis = require('./Redis.js')
    //链接redis
    await redis.connect()
    //设置key
    await redis.set('login', 'loginUser')
    //设置过期时间 单位 秒
    await redis.set('login', 'loginUser','10')
    //写入对象 会将其转换为string类型
    await redis.set('login',{user:'123'})
    //获取key
    let result = await redis.get('login')
    this.#log(result)
    //断开链接 
    redis.qiut()
 * 
 * 
 */

// 如何控制连接的断开？？？？？？？？？？
class Redis{

  client;//redis客户端
  status=0; //当前连接状态

  // 记录日志
  #log(...data){
    if($hw.DEBUG_INFO==1){
      console.log.apply(this, data);
    }
  }

  constructor() {

    let redisConfig;
    try{
      redisConfig  = require( 
        resolve(
          './app/'+$hw.APP_NAME+'/redis.config.js'
        )
      );
    }
    catch(e){
      redisConfig  = require( resolve('./app/redis.config.js') );
    }

    this.client = createClient(redisConfig);
    
    // 出错：连接不上 或 服务端主动断开
    this.client.on('error', err => {
      this.status = -1;
      this.#log('redis error: ', err.message);
    });

    // 准备就绪
    this.client.on('ready', err => {
      this.status = 1;
      this.#log('redis connected ok');
    });


    // 正在连接
    // this.client.on('connect', err => {
    //   this.status = 0;
    //   this.#log('redis connecting ...');
    // });


    // 主动断开
    this.client.on('end', err => {
      this.status = 0;
      this.#log('redis quit!');
    });

    // 重新连接
    this.client.on('reconnecting', err => {
      this.status = 0;
      this.#log('redis reconnect ... ');
    });

  }

  //建立链接
  async connect() {
    // if(this.status==1) return;

    await this.client.connect();
  }

  //断开链接
  quit() {
    this.client.quit();
    // this.status = -1;
    // this.client = undefined;
  }

  //添加数据
  async set(key, value, time) {

    //判断value值是否是对象类型
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    //time为过期时间，可选
    time 
      ? await this.client.set(key, value, {
          EX: time,
          NX: true
        }) 
      : await this.client.set(key, value);
  }


  //获取数据
  async get(key) {

    return new Promise((resolve, reject) => {
      const data = this.client.get(key);
      data ? resolve(data) : reject(false);
    });

  }

  //删除数据
  async delete(key) {
    await this.client.del(key)
  }


  /* 
   * 执行redis命令
   * 接口中没有给出的命令可以使用此方法
   * 20220607162547
   * 
   * 示例：
   * Redis.command(['SET', 'key', 'value', 'NX']);
   * Redis.command(['HGETALL', 'key']);
  */
  async cmd(cmdArr){
    await this.client.sendCommand(cmdArr);
  }

}
 
// module.exports = new Redis();
module.exports.myRedis = new Redis;

