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
			appenders: ['console', 'developFile'], 
			level: 'ALL',
		},

		// 无任何输出
		nolog:{
			appenders: ['console'], 
			level: 'OFF',
		},

		console:{
			appenders: ['console'], 
			level: 'all',
		},
		
		// file
		product: {
			appenders: ['productFile'],
			level: 'all',//只记录error以上
		},
		
		// console+file
		// develop: {
		// 	appenders: ['console', 'developFile'],
		// 	level: 'all'
		// }
	},
	
}


// 以闭包导出
log4js.configure(config);//log4写入配置

// module.exports = log4js.getLogger(modeType);
module.exports = (category)=>{
	console.log('logger 被引入');
	return log4js.getLogger(category || modeType);
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





