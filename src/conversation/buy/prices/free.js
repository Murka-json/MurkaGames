const postgresql = require("../../../../lib/postgresql/postgresql.js");


module.exports = async(ctx) => {
    const [ conv ] = await postgresql.request(`SELECT owner, gamemode FROM conversation WHERE id='${ctx.peerId}'`);

    if(ctx.messagePayload?.action === "free_conversation" && conv.owner == ctx.senderId  && !conv.gamemode) {
        ctx.send(`✅ Вы активировали бесплатную беседу`);
        
        await postgresql.request(`UPDATE conversation SET type=true, procent=1 WHERE id=${ctx.peerId}`).then(() => {
            require('../gamemodes')(ctx);
        });
    }
};