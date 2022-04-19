const router = require('../../system/Route').router;

// get
router.get('/select', async (ctx, next) => {

    // 引入db库（注意：要先配置数据库，并预先准备后数据）
    const db = require('Db.js');
    
    // 执行sql查询(从goods表中返回数据)
    let list = await db.query('select * from t_goods where id<10', [10]);
    console.log(list);
    
    // ctx.body = list;//普通返回查询数据
    await ctx.render('goods',{list});//模版显示

});


