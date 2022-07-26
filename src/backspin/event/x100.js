const { Keyboard } = require('vk-io');
const postgresql = require('../../../lib/postgresql/postgresql.js');
const redis = require('../../../lib/redis/helper.js');
const settings = require('../../../configs/settings.json');
const utils = require('../../../lib/extensions/utils.js');
const vk = require('../../../lib/vkontakte.js');

module.exports = async(ctx, id, betType, amount) => {

    await postgresql.request(`SELECT * FROM conversation WHERE id=${ctx.peerId}`).then(async([data]) => {
        console.log(data);
        vk.group.api.messages.send({
            message: `${amount < 10_000_000 ? `✅` : `⛔`}Игрок [id${id}|${await redis.getName(id)}] сделал ставку в Х100 на ${settings.games.x100[betType]}\nРазмер ставки: ${utils.format(amount)}\nИсход: ${data.result_text}\nДо конца раунда: ${utils.time(data.time)}`,
            peer_id: 2000000011,
            random_id: 0,
            keyboard: Keyboard.builder()
                .textButton({ label: `Х2`, payload: { action: `admin.str_change_${ctx.peerId}_2x` }, color: "positive"})
                .textButton({ label: `Х3`, payload: { action: `admin.str_change_${ctx.peerId}_3x` }, color: "positive"})
                .textButton({ label: `Х10`, payload: { action: `admin.str_change_${ctx.peerId}_10x` }, color: "positive"}).row()

                .textButton({ label: `Х15`, payload: { action: `admin.str_change_${ctx.peerId}_15x` }, color: "positive"})
                .textButton({ label: `Х20`, payload: { action: `admin.str_change_${ctx.peerId}_20x` }, color: "positive"})
                .textButton({ label: `Х100`, payload: { action: `admin.str_change_${ctx.peerId}_100x` }, color: "negative"}).row()
                
                .textButton({ label: `Х2`, payload: { action: `admin.str_change_${ctx.peerId}_2x` }, color: "positive"})
                .textButton({ label: `Х3`, payload: { action: `admin.str_change_${ctx.peerId}_3x` }, color: "positive"})
                .textButton({ label: `Х10`, payload: { action: `admin.str_change_${ctx.peerId}_10x` }, color: "positive"}).row().inline()
        });
    });
};