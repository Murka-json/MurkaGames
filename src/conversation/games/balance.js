const postgresql = require('../../../lib/postgresql/postgresql.js');
const utils = require('../../../lib/extensions/utils.js');
const helper = require('../../../lib/redis/helper');
const { Keyboard } = require('vk-io');

module.exports = async(ctx) => {
    if(ctx.messagePayload?.action === "balance") {
        await postgresql.request(`SELECT balance, bbalance FROM users WHERE uid='${ctx.senderId}'`).then(async([data]) => {
            ctx.send({
                message: `${await helper.getName(ctx.senderId)}, ${data.balance <= 0 && data.bbalance <= 0 ? `На вашем балансе пусто...` : `Ваш баланс: ${utils.format(data.balance)} VKC\n${data.bbalance <= 0 ? '' : `Бонусный баланс: ${utils.format(data.bbalance)} VKC`}`}`,
                keyboard: Keyboard.builder()
                    .textButton({ label: "Топ дня", payload: { action: "getTop@winday" }, color: "primary" })
                    .textButton({ label: "Топ часа", payload: { action: "getTop@winclock" }, color: "primary" }).row()
                    .textButton({ label: "Топ недели", payload: { action: "getTop@winweek" }, color: "positive" }).inline()
            });
        });
    }
};