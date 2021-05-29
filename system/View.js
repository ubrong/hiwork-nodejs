// 载入koa视图中间件
const views = require('koa-views');
const path = require("path");


// ejs配置
// ejs.delimiter = '?';//自定义义分隔符


// 导出
module.exports = (viewDir)=>{
	
	if(!viewDir) viewDir='./views';
	return views(
		path.resolve(viewDir),//模版目录：根目录下的views目录
		{
			extension: "ejs",
			// map:{ html: "ejs" }
		}
	);
	
}





