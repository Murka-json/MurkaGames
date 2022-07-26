const postgresql = require("../../../../lib/postgresql/postgresql");


module.exports = async(ctx) => {
    const [ conv ] = await postgresql.request(`SELECT owner, gamemode FROM conversation WHERE id='${ctx.peerId}'`);

    if(ctx.messagePayload?.action == "elevated_conversation" && conv.owner == ctx.senderId && !conv.gamemode) {
        const [user] = await postgresql.request(`SELECT * FROM users WHERE uid=${ctx.senderId}`);
        if(user.balance < 15000000) {
            return ctx.send(`У вас недостаточно средств.\n\nСтоимость категории "Повышенная" - 15 000 000 VKC`);
        }

        ctx.send(`✅ Вы активировали повышенную беседу`);
        await postgresql.request(`UPDATE users SET balance=round(balance - 15000000)  WHERE uid='${ctx.senderId}'`);
        await postgresql.request(`UPDATE conversation SET type='true', procent=2 WHERE id=${ctx.peerId}`).then(() => {
            require('../gamemodes')(ctx);
        });
    }
};