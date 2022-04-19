// 载入koa视图中间件
const views = require('koa-views');
const path = require("path");


// ejs配置
// ejs.delimiter = '?';//自定义义分隔符


// 导出
module.exports = (viewDir='views')=>{
	console.log('第4个中间件：view!');	

	return views(
		path.resolve(viewDir),//模版目录：根目录下的views目录
		{
			extension: "ejs",//视图后缀名：.ejs
			// map:{ html: "ejs" }
		}
	);	
}





