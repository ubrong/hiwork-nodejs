/* 
 * 核心日志库
 * 20220506142503 chy
 * 
 * 规划：
		--------------------------------------------------------
		模式				 				日志分类						输出器
		--------------------------------------------------------
		开发环境(默认)			default						developFile[all]+console[all]
		不要多余						nolog							均不输出
		console						 console					 console[all]
		正式环境						product						productFile[all]
		【删除】开发环境						develop						developFile[all]+console[all]
		--------------------------------------------------------
		注意：默认 为 开发环境，所有不存在的类别均使用开发环境。
 * 
 */

const log4js = require("log4js");
const path = require("path");

// 1.设置 日志根目录
const setLogDir = dirname => path.resolve('logs/', dirname);

// log4js配置日志器
const config = {

	// 日志输出形式
	appenders:{
		
		// ->控制台
		console:{
			type:'console'
		},

		// -> 文件 access
		access:{
			type: 'dateFile',
			filename: setLogDir('access.log'),
			pattern: '.yyyy-MM-dd',
		},

		// -> 文件 error
		error:{
			type: 'dateFile',
			filename: setLogDir('error.log'),
			pattern: '.yyyy-MM-dd',
		},

		// -> 文件 debug
		debug:{
			type: 'dateFile',
			filename: setLogDir('debug.log'),
			pattern: '.yyyy-MM-dd',
		},

	},
	
	// 日志分类
	categories: {

		default:{
			appenders: ['console'], 
			level: 'all',
		},

		// 访问日志
		access:{
			appenders: ['access'],
			level: 'all',
		},

		// 错误日志
		error:{
			appenders: ['error'],
			level: 'all',
		},

		// 调试日志
		debug:{
			appenders: ['debug'], 
			level: 'all',
		},

		// 无任何输出
		nolog:{
			appenders: ['console'], 
			level: 'OFF',
		},

	},
	
}


//写入配置
log4js.configure(config);

//导出实例
module.exports = log4js.getLogger;

/* 
let logger = log4js.getLogger('category');
logger.trace('this is default')
logger.debug('this is default')
logger.info('this is default')
logger.warn('this is default')
logger.error('this is default')
logger.fatal('this is default')
logger.mark('this is default')
 */





