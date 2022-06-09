// 导出为 node-redis 的 createClient的传入参数（即配置项）
// url格式 redis[s]://[[username][:password]@][host][:port][/db-number]

module.exports = {
  url: 'redis://:123456@localhost:6379/0',
  socket:{
    // 连接失败时不再重连 20220607111721
    reconnectStrategy(){
      // return Math.min(retries * 50, 500)
      return new Error('can not connect redis server')
    }
  }
};
