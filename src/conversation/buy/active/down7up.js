/* eslint-disable no-unused-vars */
const postgresql = require('../../../../lib/postgresql/postgresql.js');
const generate = require('../../../../lib/extensions/generate.js');
const keyboards = require('../../../../lib/extensions/keyboards.js');

module.exports = async(ctx) => {
    const [conv] = await postgresql.request(`SELECT * FROM conversation WHERE id=${ctx.peerId}`);

    if(ctx.messagePayload?.action === 'active_down7up' && conv.owner == ctx.senderId) {

        let result = generate.generateNumber(2, 12);
        let secret = generate.generateSecret(16);
        let hash = generate.hash.md5.create(`${secret}|${result}`);

        await postgresql.request(`UPDATE conversation SET gamemode='down7up', result=${result}, secret='${secret}', hash='${hash}' WHERE id=${ctx.peerId}`)
        
        .then(() => {
            ctx.send({ 
                message: `🍂 Режим Down7Up активирован.\n\n🎲 Удачных игр!`,
                keyboard: keyboards.down_7_up_keyboard
            });
        })
        .catch(e => console.log(e));
    }
};