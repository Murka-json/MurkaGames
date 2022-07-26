const utils = require('../../../lib/extensions/utils.js');
const { referalBonus } = require('../../../configs/settings.json');
const config = require(`../../../configs/config.js`);
const vk = require('../../../lib/vkontakte.js');

module.exports = async(ctx) => {
        if (ctx.messagePayload?.action === "referalSystem") {
            ctx.send(`🎁 Ваша реферальная ссылка: ${(await vk.group.api.utils.getShortLink({ url: `https://vk.com/write-${config.project.project_bot_id}?ref=${ctx.senderId}&ref_source=` })).short_url}\nЗа переход вашего друга по ссылке вы получите - ${utils.toKformat(referalBonus.referalUserOwner)}, а ваш друг - ${utils.toKformat(referalBonus.referalUserTransition)}  `);
    }
};