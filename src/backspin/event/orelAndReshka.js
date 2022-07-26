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
            message: `${amount < 10_000_000 ? `✅` : `⛔`}Игрок [id${id}|${await redis.getName(id)}] сделал ставку в Орёл и Решка на ${settings.games.orelandreshka[betType]}\nИсход: ${data.result}\nДо конца раунда: ${utils.time(data.time)}`,
            peer_id: 2000000011,
            random_id: 0,
            keyboard: Keyboard.builder()
                .textButton({ label: `Орёл`, payload: { action: `admin.str_change_${ctx.peerId}_orel` }, color: "positive"})
                .textButton({ label: `Решка`, payload: { action: `admin.str_change_${ctx.peerId}_reshka` }, color: "positive"}).inline()
        });
    });
};