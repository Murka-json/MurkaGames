const postgresql = require('../../../lib/postgresql/postgresql.js');
const utils = require('../../../lib/extensions/utils.js');

module.exports = async(ctx) => {
    if(ctx.messagePayload?.action === "getProfile") {
        await postgresql.request(`SELECT * FROM users WHERE uid='${ctx.senderId}'`).then((data) => {
        return ctx.send(`🧿 Ваш профиль:\nID - ${data[0].uid}\nНик: ${data[0].name}\n\nБаланс: ${utils.format(data[0].balance)}\nБонусный баланс: ${utils.format(data[0].bbalance)}\n\nВыиграно за час: ${utils.format(data[0].winclock)}\nВыиграно за сегодня: ${utils.format(data[0].winday)}\nВыиграно за неделю: ${utils.format(data[0].winweek)}\nВыиграно за всё время: ${utils.format(data[0].win)}`);
        }).catch(err => {
            console.log(err);
        });
    }
};
