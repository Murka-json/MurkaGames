/* eslint-disable no-empty */
const postgresql = require('../../lib/postgresql/postgresql.js');
const generate = require('../../lib/extensions/generate.js');

module.exports = async (ctx) => {
    try {
        const result = ctx.messagePayload?.action.split("_");
        console.log(result);
        if (result[0] == "admin") {
            let secret = generate.generateSecret(20);

            await postgresql.request(`UPDATE conversation SET result=${Number(result[3])}, secret='${secret}' WHERE id=${result[2]}`).then(() => {
                return ctx.send(`Результаты игры изменены!\nSecret: ${secret}\nresult: ${Number(result[3])}`);
            });
        }
    } catch (e) { }
};