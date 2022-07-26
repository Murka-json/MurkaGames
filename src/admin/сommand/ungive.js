const postgresql = require('../../../lib/postgresql/postgresql.js');

module.exports = async(ctx) => {
    const command = ctx.text?.split(" ");

    if(command[0] == "/ungive") {
        if(command[1] == "balance") {
            postgresql.request(`UPDATE users SET balance=0 WHERE uid=${ctx.replyMessage.senderId}`)

            .then(() => ctx.send(`Вы сняли баланс [id${ctx.replyMessage.senderId}|Пользователю]`))
            .catch(() => ctx.send(`При снятии коинов произошла ошибка`));
        }

        if(command[1] == "bbalance") {
            postgresql.request(`UPDATE users SET bbalance=0 WHERE uid=${ctx.replyMessage.senderId}`)

            .then(() => ctx.send(`Вы сняли бонусный баланс [id${ctx.replyMessage.senderId}|Пользователю]`))
            .catch(() => ctx.send(`При снятии коинов произошла ошибка`));
        }

        if(command[1] == "all") {
            postgresql.request(`UPDATE users SET bbalance=0, bbalance=0, win=0, winday=0, winclock=0, winweek=0 WHERE uid=${ctx.replyMessage.senderId}`)

            .then(() => ctx.send(`Вы сняли бонусный баланс [id${ctx.replyMessage.senderId}|Пользователю]`))
            .catch(() => ctx.send(`При снятии коинов произошла ошибка`));
        }
    }
};