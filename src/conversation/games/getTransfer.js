const utils = require('../../../lib/extensions/utils.js');
const postgresql = require('../../../lib/postgresql/postgresql.js');
const helper = require('../../../lib/redis/helper.js');

module.exports = async(ctx) => {
    const command = ctx.text?.split(" ");

    if(/Перевод/i.test(command[0])) {
        let sum = Number(command[1]);

        let [ userData ] = await postgresql.request(`SELECT * FROM users WHERE uid=${ctx.senderId}`);

        if(sum < 0 || sum > userData.balance || isNaN(sum)) {
            return ctx.send(`К сожалению, данную сумму перевести нельзя.`);
        }

        if(ctx.replyMessage.senderId == ctx.senderId) {
            return ctx.send(`К сожалению, как бы не хотелось, но перевести самому себе нельзя.`);
        }

        await postgresql.request(`UPDATE users SET balance=round(balance-${sum}) WHERE uid=${ctx.senderId}`);
        await postgresql.request(`UPDATE users SET balance=round(balance+${sum}) WHERE uid=${ctx.replyMessage.senderId}`).then(async() => {
            return ctx.send(`✅Транзакция успешна!\n\nСумма: ${utils.format(sum)}\nПольчатель: ${await helper.getName(ctx.replyMessage.senderId)}`);
        });
    }
};