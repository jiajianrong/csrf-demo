## CSRF防御demo



#### nodejs端防御规则

- step1，判别是否post，否的话无需防御
- step2，判别是否当前url属于白名单：是则无需防御
- step3，获取cookie ppu：如果未获取，则认为无需防御
- step4，ppu存在：获取 http header x-csrf-token
- step5，判断x-csrf-token与ppu是否相同：是则认为通过校验，否则拒绝服务




#### browser端请求规则

- step1，POST请求时，添加header x-csrf-token，值为PPU cookie
- step2，cookie无PPU时，x-csrf-token可以为空，或者null；或者干脆不设置x-csrf-token