const path = require('path');
const router = require(path.resolve('system/core/Route')).router;

// get
router.get('/select', async (ctx, next) => {

    // 引入db库（注意：要先配置数据库，并预先准备后数据）
    const db = require( path.resolve('system/library/Db.js') );
    
    // 执行sql查询(从goods表中返回数据)
    let rows = await db.query('select * from t_wy_goods order by id desc limit  30', [10]);
    console.log(rows);
    
    // ctx.body = list;//普通返回查询数据
    await ctx.render('goods', {rows});//模版显示
 
});


