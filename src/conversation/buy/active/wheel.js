/* eslint-disable no-unused-vars */
const postgresql = require('../../../../lib/postgresql/postgresql.js');
const generate = require('../../../../lib/extensions/generate.js');
const keyboards = require('../../../../lib/extensions/keyboards.js');

module.exports = async(ctx) => {
    const [conv] = await postgresql.request(`SELECT * FROM conversation WHERE id=${ctx.peerId}`);

    if(ctx.messagePayload?.action === 'active_wheel' && conv.owner == ctx.senderId) {

        let result = generate.generateNumber(0, 36);
        let secret = generate.generateSecret(20);
        let hash = generate.hash.md5.create(`${secret}|${result}`);

        await postgresql.request(`UPDATE conversation SET gamemode='wheel', result=${result}, secret='${secret}', hash='${hash}' WHERE id=${ctx.peerId}`)
        
        .then(() => {
            ctx.send({ 
                message: `🍂 Режим Wheel активирован.\n\n🎲 Удачных игр!`,
                keyboard: keyboards.wheel_keyboard
            });
        })
        .catch(e => console.log(e));
    }
};