const postgresql = require('../../../lib/postgresql/postgresql.js');
const keyboards = require('../../../lib/extensions/keyboards');
const vk = require('../../../lib/vkontakte.js');

module.exports = async (ctx) => {
    const [conv] = await postgresql.request(`SELECT * FROM conversation WHERE id='${ctx.peerId}'`);
    
    if (!ctx?.messagePayload && !conv?.type && !conv?.gamemode) {
        const { items } = await vk.group.api.messages.getConversationMembers({ peer_id: ctx.peerId });

        postgresql.request(
            `INSERT INTO conversation (id, owner, type, time, state_timer, win, official) VALUES (${ctx.peerId}, ${items[0].member_id}, false, 60, 60, 0, false)`
        )
            .catch(err => {
                if (err.code != '23505') throw err;
            });

        // await postgresql.request(`SELECT * FROM conversation`).then(([data]) => {
        //     if (!data.type) {
                return ctx.send({
                    message: `😎 Привет всем игрокам!\n\n🔥 Для активации беседы назначьте бота Администратором беседы, а также выберите категорию беседы.`,
                    keyboard: keyboards.category_сonv_keyboard
                });
            //}
        //});
    }
};