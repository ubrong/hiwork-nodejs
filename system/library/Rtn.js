
const ok = function(msg="success", dt=[]){
	// console.log(arguments);
	let time = (new Date).getTime();
	
	return typeof arguments[0]=="object" 
		? {st:1, msg:'success', time, dt:arguments[0]}
		: {st:1, msg, time, dt};
}

const err = function(msg="fail", data=[]){
	
	let time = (new Date).getTime();
	
	return typeof arguments[0]=="object"
		? {st:0, msg:'fail', time, dt:arguments[0]}
		: {st:0, msg, time, dt};
}

// 导出日志实例
module.exports = {
	ok,
	err,
};

