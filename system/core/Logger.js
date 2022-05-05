const log4js = require("log4js");
const path = require("path");
const modeType = require(path.resolve('config.js')).modeType;

// 1.设置 日志根目录
const setLogDir = dirname => path.resolve('run/logs/', dirname);

// log4js配置日志器
const config = {

	// 日志输出形式
	appenders:{
		
		// ->控制台
		console:{
			type:'console'
		},
		
		// 错误->文件
		// debugFile:{
		// 	type:'dateFile',
		// 	filename:setLogDir('errorDebug.log'),
		// 	pattern: '.yyyy-MM-dd',
		// },
		
		// 错误->文件
		errorFile:{
			type: 'dateFile',
			filename: setLogDir('error.log'),
			pattern: '.yyyy-MM-dd',
		}
	},
	
	// 分类以及日志等级
	categories: {
		
		// 默认（不推荐）->控制台
		default: {
			appenders: ['console'], 
			level: 'all',
		},
		
		// 调试需求->文件 (与环境区别：文件在info.log中)
		// info: {
		// 	appenders: ['console', 'info'],
		// 	level: 'all',
		// },
		
		
		// 正式环境
		product: {
			appenders: ['errorFile'],
			level: 'error',//只记录error以上
		},
		
		// 开发环境(日志文件为)
		develop: {
			appenders: ['console', 'errorFile'],
			level: 'all'
		}
	},
	
}


// 以闭包导出
log4js.configure(config);//log4写入配置

module.exports = log4js.getLogger(modeType);


/* 
//在koa中间件加入logger
module.exports = async (ctx, next)=>{
	console.log('第3个中间件：logger!');	
	
	// 将logger写入ctx.state
	ctx.state.logger = logType=>{
		// console.log('当前模式： '+(logType || ctx.state.modeType) );
		return log4js.getLogger(logType || ctx.state.modeType || 'default');
	}
	
	// console.log('logger module used!');
	await next();
}  
*/



/* 
let logger = log4js.getLogger('errLogger');
logger.trace('this is default')
logger.debug('this is default')
logger.info('this is default')
logger.warn('this is default')
logger.error('this is default')
logger.fatal('this is default')
logger.mark('this is default')
 */





