const postgresql = require("../../../lib/postgresql/postgresql");
const utils = require('../../../lib/extensions/utils.js');
const settings = require('../../../configs/settings.json');

module.exports = async(ctx) => {
    if(ctx.messagePayload?.action == "convTop@winconvs") {
        let topText = ``;
        let currentPosition = 0;
        await postgresql.request(`SELECT * FROM conversation ORDER BY win DESC LIMIT 5`).then(async(data) => {
            for(let i in data) {
                currentPosition++;
                topText += `${currentPosition}. ${data[i].name ? `[id${data[i].owner}|${data[i].name}]` : `[id${data[i].owner}|Беседа]`}  выиграла ${utils.format(data[i].win)} VKC (Приз ${utils.toKformat(settings.amountWin.convWin[currentPosition - 1])})`;
            }
        });

        return ctx.send(`💫 Топ бесед на 200КК:\n\n${topText}\n\n♻ Выдача призов каждое воскресенье в 00:00 по МСК`);
    }
};