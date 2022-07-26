const postgresql = require('../../../lib/postgresql/postgresql.js');

module.exports = (ctx) => {
    const command = ctx.text?.split(" ");
    if (command[0] == "/give") {
        if (command[1] == "balance") {
            if (ctx.replyMessage.senderId > 0) {
                postgresql.request(`UPDATE users SET balance=round(balance+${command[2]}) WHERE uid=${ctx.replyMessage.senderId}`)

                    .then(() => ctx.send(`Коины выданы [id${ctx.replyMessage.senderId}|Пользователю]`))
                    .catch(() => ctx.send(`При выдаче коинов произошла ошибка`));
            }
        }

        if (command[1] == "bbalance") {
            if (ctx.replyMessage.senderId > 0) {
                postgresql.request(`UPDATE users SET bbalance=round(balance+${command[2]}) WHERE uid=${ctx.replyMessage.senderId}`)

                    .then(() => ctx.send(`Коины выданы [id${ctx.replyMessage.senderId}|Пользователю]`))
                    .catch(() => ctx.send(`При выдаче коинов произошла ошибка`));
            }
        }
    }
};