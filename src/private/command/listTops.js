const keyboards = require('../../../lib/extensions/keyboards.js');

module.exports = async(ctx) => {
    if (ctx.messagePayload?.action === "tops") {
        await ctx.send({
            message: `🤔 Как топ Вас интересует?`,
            keyboard: keyboards.tops_keyboard
        });
    }
};