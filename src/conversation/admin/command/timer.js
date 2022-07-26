const utils = require('../../../../lib/extensions/utils.js');
const postgresql = require('../../../../lib/postgresql/postgresql.js');

module.exports = async(ctx) => {
    const command = ctx.text?.split(" ");

    if(command[0] == "/timer") {
        await postgresql.request(`UPDATE conversation SET time=${command[1]}`).then(async() => {
            let time = Number(command[1]);
            ctx.send(`Вы успешно установили таймер на ${utils.time(time)}`);
            await postgresql.request(`UPDATE conversation SET time=${time}`);
        });
    }
};