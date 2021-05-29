const path = require('path');

// 中间件公用数据：stat
const state = {
	// 根目录
	docRoot: path.join(__dirname, '../'),
	
}

// 导出闭包
module.exports = async (ctx, next)=>{
	
	for(let k in state){
		ctx.state[k] = state[k];
	}
	
	
	await next();
	// next();
	
}












