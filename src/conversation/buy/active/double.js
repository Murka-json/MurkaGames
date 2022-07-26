/* eslint-disable no-unused-vars */
const postgresql = require('../../../../lib/postgresql/postgresql.js');
const generate = require('../../../../lib/extensions/generate.js');
const keyboards = require('../../../../lib/extensions/keyboards.js');

module.exports = async(ctx) => {
    const [conv] = await postgresql.request(`SELECT * FROM conversation WHERE id=${ctx.peerId}`);

    if(ctx.messagePayload?.action === 'active_double' && conv.owner == ctx.senderId) {

        let result = generate.generateNumber(1, 28);
        if (result >= 1 && result <= 15) result = "x2";
        if (result >= 16 && result <= 21) result = "x3";
        if (result >= 22 && result <= 26) result = "x5";
        if (result >= 27 && result <= 28) result = "x10";

        let secret = generate.generateSecret(16);
        let hash = generate.hash.md5.create(`${secret}|${result}`);

        await postgresql.request(`UPDATE conversation SET gamemode='dice', result_text='${result}', secret='${secret}', hash='${hash}' WHERE id=${ctx.peerId}`)
        
        .then(() => {
            ctx.send({ 
                message: `🍂 Режим Double активирован.\n\n🎲 Удачных игр!`,
                keyboard: keyboards.double_keyboard
            });
        })
        .catch(e => console.log(e));
    }
};