const log4js = require("log4js");

// 日志根目录
const path = require("path");
// const baseDir = path.resolve('./run/logs/');
const setLogDir = dirname => path.resolve('./run/logs/', dirname);


// log4js配置日志器
const config = {

	appenders:{
		
		// ->控制台
		console:{
			type:'console'
		},
		
		// 信息->文件
		debug:{
			type:'dateFile',
			filename:setLogDir('info.log'),
			pattern: '.yyyy-MM-dd',
		},
		
		// 错误->文件
		error:{
			type: 'dateFile',
			filename: setLogDir('error.log'),
			pattern: '.yyyy-MM-dd',
			
		}
	},
	
	// 分类以及日志等级
	categories: {
		
		// 默认->控制台
		default: {
			appenders: [ 'console'], 
			level: 'all',
		},
		
		// 信息->文件
		debug: {
			appenders: ['debug'],
			level: 'debug',
		},
		
		// 错误->文件
		error: {
			appenders: ['error'],
			level: 'error'
		}
	},
	
}

module.exports = async (ctx, next)=>{
	
	log4js.configure(config);//log4写入配置
	
	ctx.state.logger = loggerCate=>log4js.getLogger(loggerCate);
	
	await next();
}

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





