const path = require('path');

// 测试：
// console.log(__dirname)
// console.log(path.join(__dirname, 'abc'));
// console.log(path.resolve())
	

// 中间件公用数据：stat
const state = {
	// 根目录
	docRoot: path.resolve(),//默认最后无/,
	
}

// 导出闭包
module.exports = async (ctx, next)=>{
	
	for(let k in state){
		ctx.state[k] = state[k];
	}
	
	await next();
	// next();
	
}












