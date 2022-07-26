const postgresql = require('../../../lib/postgresql/postgresql.js');
const utils = require('../../../lib/extensions/utils.js');

module.exports = async(ctx) => {
    const command = ctx.text?.split(" ");

    if(command[0] == "/info") {
        console.log(ctx.replyMessage.senderId);
        let save = Date.now();
        await postgresql.request(`SELECT * FROM users WHERE uid=${ctx.replyMessage.senderId}`).then(([data]) => {
            console.log(Date.now() - save + "ms");
            ctx.send(`ID: ${data.uid}\nИмя: ${data.name}\n\nБаланс: ${utils.format(data.balance)}\nБонусный баланс: ${utils.format(data.bbalance)}\n\nВыиграно: ${utils.format(data.win)}\nЗа день: ${utils.format(data.winday)}\nЗа час: ${utils.format(data.winclock)}\nЗа неделю: ${utils.format(data.winweek)}`);
        });
    }
};