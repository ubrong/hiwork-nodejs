/* 
 * 核心日志库
 * 20220506142503 chy
 * 
 * 规划：
		--------------------------------------------------------
		用途				 		日志类别						输出器
		--------------------------------------------------------
		调试(任意)			default::any			debugFile[all]+console[all]
		不要多余				nolog							console[off]
		正式环境				product						productFile[all]
		开发环境				develop						developFile[all]+console[all]
		--------------------------------------------------------
 * 
 */

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
		
		// -> 文件 debug
		debugFile:{
			type: 'dateFile',
			filename: setLogDir('debug.log'),
			pattern: '.yyyy-MM-dd',
		},

		// -> 文件 develop
		developFile:{
			type: 'dateFile',
			filename: setLogDir('develop.log'),
			pattern: '.yyyy-MM-dd',
		},

		// -> 文件 product
		productFile:{
			type: 'dateFile',
			filename: setLogDir('product.log'),
			pattern: '.yyyy-MM-dd',
		}


	},
	
	// 日志分类
	categories: {
		
		// 默认：console+file(当调用的分类不存在时将被调用)
		default: {
			appenders: ['console', 'debugFile'], 
			level: 'ALL',
		},

		// 无任何输出
		nolog:{
			appenders: ['console'], 
			level: 'OFF',
		},
		
		// file
		product: {
			appenders: ['productFile'],
			level: 'all',//只记录error以上
		},
		
		// console+file
		develop: {
			appenders: ['console', 'developFile'],
			level: 'all'
		}
	},
	
}


// 以闭包导出
log4js.configure(config);//log4写入配置

// module.exports = log4js.getLogger(modeType);
module.exports = (category=modeType)=>{
	return log4js.getLogger(category);
}


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





