const path = require('path');

// 测试：
// console.log(__dirname)
// console.log(path.join(__dirname, 'abc'));
// console.log(path.resolve())

// 1.配置级数据(这些数据将做为中间件数据传递)
const state = require('../config.js');

// 2.计算级数据
state.docRoot = path.resolve(),//默认最后无/,

// console.log(state);


// 导出闭包
module.exports = async (ctx, next)=>{
	
	for(let k in state){
		ctx.state[k] = state[k];
	}
	
	await next();
}












