const mysql  = require('mysql');  
const path  = require('path');  


// 连接
const connect = ()=>{
	
	// 数据库配置
	let dbConfig  = require( path.resolve('./app/db.js') );  
	
	// 创建连接池
	const pool  = mysql.createPool(dbConfig);
	
	// 返回promise接连结果
	return new Promise((res, rej)=>{
		pool.getConnection((err, conn)=>{
			err ? rej(err) : res(conn);
		})
	});
}

// 执行
const query = async (sql, params)=>{
	
	// 连接
	let db = await connect();
	
	return new Promise((res,rej)=>{
		
		// 执行
		db.query(sql, params, (e,r,fields)=>{
			e ? rej(e) : res(r);
		});
		
		// 释放连接
		db.release();
	});
}


/* 
 * 读取
 * fetchType int 2:二维数组， 1:一维数组
 */
const select = async (sql, params, fetchType=2)=>{
	let r = await query(sql, params);
	// console.log(r);
	
	if(!r) return []; 
	return fetchType===1 ? r[0] : r ;
}


/* 
  * 执行（增删改）
  * 
  * 其它说明：如果是插入语句，也可以使用下面的方法
	var post  = {id: 1, title: 'Hello MySQL'};
	var query = connection.query('INSERT INTO posts SET ?', post, function (error, results, fields) {});
	INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
 */
const execute = async (sql, params)=>{
	let r = await query(sql, params);
	return {matched:r.affectedRows, changed:r.changedRows , warning:r.warningCount};
}


//事务 
const transaction = async sqlArr => {
	// 连接
	let conn = await connect();
	
	return new Promise((res, rej)=>{
		
		// 开始事务
		conn.beginTransaction(e=>{
			if(e){rej(e);return;}
			
			// 逐个执行
			let result=[];
			for(let sqlObj of sqlArr){
				conn.query(sqlObj.sql, sqlObj.params, (e, r)=>{
					
					if(e) return conn.rollback(()=>rej(e));
										
					result.push(r);//加入结果
					
					// console.log(result.length,sqlArr.length);
					// 处理完成后，提交事务
					if(result.length==sqlArr.length){
						// 提交
						conn.commit((e)=>{
							e ? conn.rollback(()=>rej(e)) : res(result);
						})
					}
				});
			}
		});
	});
};
	
	
	
	
//= await 写法的事务处理 =================== 
	
// 开启事务
const _beginTransaction = async ()=>{
	let conn = await connect();
	
	return new Promise((res, rej)=>{
		conn.beginTransaction(e=>{
			e ? rej(e) : res(conn); 
		})
	})
}

// 提交事务
const _commitTransaction = (conn, result)=>{
	return new Promise((res,rej)=>{
		conn.commit(e=>{
			e ? conn.rollback(()=>rej(e)) : res(result);
			conn.release();
		})
	});
}
	
//事务 
const transactionAwait = async (sqlArr)=>{

		// 开启事务 并 连接
		let conn = await _beginTransaction();
		// console.log(conn);
		
		// 执行一条
		const tran = (sql, params)=>{
			return new Promise((res,rej)=>{
				conn.query(sql, params, (e,r)=>{
					e ? rej(e) : res(r);
				})
			});
		}
		
		// 执行
		let one, result=[];
		for(let sqlObj of sqlArr){
			one = await tran(sqlObj.sql, sqlObj.params);
			
			result.push(one);

			// 提交
			if(result.length==sqlArr.length){
				return await _commitTransaction(conn, result);
			}
		}
	
}







module.exports={
	query,
	transaction,
	select,
	execute,
	// transactionAwait,
	// execute,
}







