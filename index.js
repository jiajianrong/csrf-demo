const Koa = require('koa');
const app = new Koa();
var path = require('path');
var router = require('koa-router')()
var staticServer = require('koa-static');

var isCsrfAttack = require('./koa-csrf-detect')('PPU', 'x-csrf-token');


app.use(async (ctx, next) => {
    await next();
})


app.use( staticServer( path.resolve('views') ) );



// 判断如果是csrf攻击，拒接访问
app.use(async (ctx, next) => {
    if (isCsrfAttack(ctx)) {
        ctx.status = 403;
        ctx.body = {
            code: -1000000,
            msg: 'csrf attack detected!',
            data: null,
        };
        return;
    }
    await next();
})



router.post('/post', async (ctx, next) => {
  ctx.body = {code: 0, msg: 'post'};
})
app.use(router.routes());  
app.use(router.allowedMethods());



app.use(async (ctx, next) => {
    ctx.body = {code: 0, msg: 'the end'};
})



app.listen(3005).on('clientError', (err, socket) => {
    handleErr(err, 'caught_by_koa_on_client_error');
    socket.end('HTTP/1.1 400 Bad Request Request invalid\r\n\r\n');
});
