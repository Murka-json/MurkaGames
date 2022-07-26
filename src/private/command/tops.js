const postgresql = require('../../../lib/postgresql/postgresql.js');
const helper = require('../../../lib/redis/helper');
const { TypeTextTop, amountWin,  DataGetPrices } = require('../../../configs/settings.json');
const utils = require('../../../lib/extensions/utils.js');

module.exports = async (ctx) => {
    if (ctx.messagePayload?.action?.split("@")[0] == "getTop") {
        let typeTop = ctx.messagePayload.action.split("@")[1];
        let topText = ``;
        let currentPosition = 0;
        await postgresql.request(`SELECT * FROM users ORDER BY ${typeTop} DESC LIMIT 10`).then(async (data) => {
            
            for (let i in data) {
                currentPosition++;
                topText += `${currentPosition}. ${await helper.getName(data[i].uid)} выиграл ${utils.format(data[i][typeTop])} VKC ${typeTop !== "win" ? `(Приз ${utils.toKformat(amountWin[typeTop][currentPosition - 1])})` : ``}\n`;
            }
        });

        return ctx.send(`${TypeTextTop[typeTop]}\n${topText}\n${DataGetPrices[typeTop]}`);
    }
};