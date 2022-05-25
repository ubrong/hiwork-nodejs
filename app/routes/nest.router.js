const path = require('path');
const {router, setRegExpUri}  = require(path.resolve('system/core/Route'));

/**  
 * 本案例文件展示了分组路由的使用
 * 20220517122323 chy
 */

let groupRouter = require('koa-router')();

groupRouter.get('/', async (ctx, next) => {
  ctx.RTN.success('ok', 'china data!');
});

groupRouter.get("/beijing", async (ctx, next) => {
  ctx.RTN.success('ok', 'china-beijing data!');
});

groupRouter.get('/shanghai', async (ctx, next) => {
  ctx.RTN.success('ok', 'china-shanghai data!');
});

// 写入到顶级路由+正则
router.get('/zhejiang/(\\d+)', async (ctx, next) => {
  // console.log(ctx.params);
  ctx.RTN.success('ok', 'zhejiang -> cityId : '+ctx.params[0]);
});

// 写入到分组路由+正则
groupRouter.get('/zhejiang/(\\d+)', async (ctx, next) => {
  // console.log(ctx.params);
  ctx.RTN.success('ok', 'zhejiang -> cityId : '+ctx.params[0]);
});


router.use('/china', groupRouter.routes());
