/* eslint-disable no-unused-vars */
const postgresql = require('../../../../lib/postgresql/postgresql.js');
const generate = require('../../../../lib/extensions/generate.js');
const keyboards = require('../../../../lib/extensions/keyboards.js');

module.exports = async (ctx) => {
    const [conv] = await postgresql.request(`SELECT * FROM conversation WHERE id=${ctx.peerId}`);

    if (ctx.messagePayload?.action === 'active_lite' && conv.owner == ctx.senderId) {
        let result = generate.generateNumber(0, 12);
        let secret = generate.generateSecret(20);
        let hash = generate.hash.md5.create(`${secret}|${result}`);

        await postgresql.request(`UPDATE conversation SET gamemode='litewheel', secret='${secret}', result=${result}, hash='${hash}'`)
        
        .then(() => {
            ctx.send({
                message: `🍂 Режим Lite Wheel активирован.\n\n🎲 Удачных игр!`,
                keyboard: keyboards.lite_wheel
            });
        })
        .catch(e => console.log(e));
    }
};
