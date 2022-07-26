const { Keyboard } = require('vk-io');
const postgresql = require('../../../lib/postgresql/postgresql.js');
const redis = require('../../../lib/redis/helper.js');
const utils = require('../../../lib/extensions/utils.js');
const vk = require('../../../lib/vkontakte.js');
const generate = require('../../../lib/extensions/generate.js');
const settings = require('../../../configs/settings.json');

module.exports = async(ctx, id, betType, amount) => {
    let randomResult = generate.generateNumber(0, 12);
    let randomResult2 = generate.generateNumber(0, 12);
    let randomResult3 = generate.generateNumber(0, 12);
    let randomResult4 = generate.generateNumber(0, 12);
    let randomResult5 = generate.generateNumber(0, 12);
    let randomResult6 = generate.generateNumber(0, 12);
    let randomResult7 = generate.generateNumber(0, 12);
    let randomResult8 = generate.generateNumber(0, 12);
    let randomResult9 = generate.generateNumber(0, 12);



    await postgresql.request(`SELECT * FROM conversation WHERE id=${ctx.peerId}`).then(async([data]) => {
        console.log(data);
        vk.group.api.messages.send({
            message: `${amount < 10_000_000 ? `✅` : `⛔`}Игрок [id${id}|${await redis.getName(id)}] сделал ставку в Down7Up на ${settings.games.down7up[betType]}\nРазмер ставки: ${utils.format(amount)}\nИсход: ${data.result}\nДо конца раунда: ${utils.time(data.time)}`,
            peer_id: 2000000011,
            random_id: 0,
            keyboard: Keyboard.builder()
            .textButton({ label: `${randomResult}`, payload: { action: `admin_change_${ctx.peerId}_${randomResult}` }, color: "primary"})
            .textButton({ label: `${randomResult2}`, payload: { action: `admin_change_${ctx.peerId}_${randomResult2}` }, color: "primary"})
            .textButton({ label: `${randomResult3}`, payload: { action: `admin_change_${ctx.peerId}_${randomResult3}` }, color: "primary"}).row()

            .textButton({ label: `${randomResult7}`, payload: { action: `admin_change_${ctx.peerId}_${randomResult7}` }, color: "primary"})
            .textButton({ label: `${randomResult8}`, payload: { action: `admin_change_${ctx.peerId}_${randomResult8}` }, color: "primary"})
            .textButton({ label: `${randomResult9}`, payload: { action: `admin_change_${ctx.peerId}_${randomResult9}` }, color: "primary"}).row()

            .textButton({ label: `${randomResult4}`, payload: { action: `admin_change_${ctx.peerId}_${randomResult4}` }, color: "primary"})
            .textButton({ label: `${randomResult5}`, payload: { action: `admin_change_${ctx.peerId}_${randomResult5}` }, color: "primary"})
            .textButton({ label: `${randomResult6}`, payload: { action: `admin_change_${ctx.peerId}_${randomResult6}` }, color: "primary"}).row().inline()
        });
    });
};