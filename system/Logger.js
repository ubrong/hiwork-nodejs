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
		debugFile:{
			type:'dateFile',
			filename:setLogDir('info.log'),
			pattern: '.yyyy-MM-dd',
		},
		
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
		
		// 调试需求->文件 (与开发环境区别：文件在info.log中)
		debug: {
			appenders: ['console', 'debugFile'],
			level: 'all',
		},
		
		
		// 正式环境
		product: {
			appenders: ['errorFile'],
			level: 'error',//只记录error以上
		},
		
		// 开发环境
		develop: {
			appenders: ['console', 'errorFile'],
			level: 'all'
		}
	},
	
}

module.exports = async (ctx, next)=>{
	
	log4js.configure(config);//log4写入配置
	
	// 将logger写入ctx.state
	ctx.state.logger = logType=>{
		
		if(!logType){
			// console.log('当前模式： '+ctx.state.modeType);
			logType = ctx.state.modeType=='develop' ? 'develop' : 'product';
		}
		
		// 返回logger
		return log4js.getLogger(logType);
	}
	
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





