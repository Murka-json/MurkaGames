/* eslint-disable no-undef */
const vk = require('../lib/vkontakte.js');
const redis = require('../lib/redis/redis.js');


vk.group.updates.on("message", async (ctx) => {
    // redis.set("bot#settings", JSON.stringify({ newsender: false, active: true }));
    console.log(ctx.peerId);
    // Админка
    require('./admin/main')(ctx);
    //Проверка на работу бота
    await redis.get("bot#settings").then(async (data) => {
        if (!JSON.parse(data).active) {
            if (ctx.messagePayload) return ctx.send(`Бот временно неактивен.`);

        } else {
            if (!ctx.text || ctx.isOutbox || ctx.senderId < 0) return;

            // Глобальные команды и сервсиы
            require('./conversation/games/replenish')(ctx);
            require('./core/register')(vk, ctx);
            require('./core/chatManager')(ctx);

            // ? Покрутка :)))))))))))))))))))
            require('./backspin/number')(ctx);
            require('./backspin/string')(ctx);

            // Распределение команд
            if (ctx.isChat) {
                await require('./conversation/main')(ctx);
            } else {
                await require('./private/main')(ctx);
            }
        }
    });
});

module.exports = {
    updates: {
        start: async () => {
            // ? Режимы
            require('./conversation/gamemodes/wheel')();
            require('./conversation/gamemodes/x100')();
            require('./conversation/gamemodes/dice')();
            require('./conversation/gamemodes/litewheel')();
            require('./conversation/gamemodes/orelAndReshka')();
            require('./conversation/gamemodes/double')();
            require('./conversation/gamemodes/down7up')();

            // ? Реферальная система
            require('./core/newReferal')();
        },
    },
};


process.on("uncaughtException", async (err) => {
    return console.log(err);
});