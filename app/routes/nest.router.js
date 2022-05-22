const path = require('path');
const router = require(path.resolve('system/core/Route')).router;

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


router.use('/china', groupRouter.routes());
