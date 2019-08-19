// csrf防御规则
/*
- step1，判别是否post，否的话无需防御
- step2，判别是否当前url属于白名单：是则无需防御
- step3，获取cookie ppu：如果未获取，则认为无需防御
- step4，ppu存在：获取 http header x-csrf-token
- step5，判断x-csrf-token与ppu是否相同：是则认为通过校验，否则拒绝服务
*/


/**
 * 纯函数判断
 * demo
```
    var isCsrfAttack = require('./koa-csrf-detect')('PPU', 'x-csrf-token');
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
```
 * 
 * @param {Object} csrfCookieKey
 * @param {Object} csrfHeaderKey
 * @param {Array} whitelist - can be ignored
 * @return true when it's a csrf attack; otherwise return false
 */
module.exports = function (csrfCookieKey, csrfHeaderKey, whitelist=[]) {
    
    // check if url is in whitelist
    function hitWhitelist(url) {
        return whitelist.some(item => url.startWith(item) || (item.test && item.test(url)))
    }
    
    return function isCsrfAttack(ctx) {
        
        // 非post请求无需校验
        if (ctx.method.toUpperCase()!=='POST') {
            return false;
        }
        
        // 白名单请求无需校验
        if (hitWhitelist(ctx.url)) {
            return false;
        }
        
        let csrfCookieVal = ctx.cookies.get(csrfCookieKey);
        let csrfHeaderVal = ctx.get(csrfHeaderKey);
        
        // 无身份用户无需校验
        if (!csrfCookieVal) {
            return false;
        }
        // 通过校验
        if (csrfCookieVal==csrfHeaderVal) {
            return false;
        }
        
        console.log('csrf check failed', csrfCookieKey+'='+csrfCookieVal, csrfHeaderKey+'='+csrfHeaderVal);
        
        return true;
    }
}














