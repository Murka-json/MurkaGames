const { vkcoin } = require('../../../configs/config');

module.exports = (ctx) => {
    if(ctx.messagePayload?.action == "replenish") {
        return ctx.send(`Ссылка на пополнение:\nhttps://vk.com/coin#x${vkcoin.vkcoin_private_user_id}_1000_${vkcoin.vkcoin_transer_payload}_1`);
    }
};