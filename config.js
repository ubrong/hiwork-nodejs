/* 
	配置说明：
	modeType： develop|product
		develop: 所有logger均被console和error.log记录
		product: 所有logger均被error.log记录
 
 */


module.exports={

	//modeType模式，会影响到错误与日志
	// 错误: {develop:开发（显示错误，但不记录）, product:生产（不显示错误，不记录）, 'none':无任何日志}
	// 日志：

	/* 
	 * modeType模式
		---------------------------------------------
		modeType		错误epage		日志file		console
		---------------------------------------------
		develop				Y					 	Y						Y
		product				N			 			Y						N
		nolog					Y						N						N
		---------------------------------------------
	 * 	
	 */


	modeType: 'develop',//develop product nolog
}
