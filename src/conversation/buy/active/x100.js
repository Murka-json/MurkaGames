const postgresql = require('../../../../lib/postgresql/postgresql.js');
const generate = require('../../../../lib/extensions/generate.js');
const keyboards = require('../../../../lib/extensions/keyboards.js');

module.exports = async (ctx) => {
    const [conv] = await postgresql.request(`SELECT * FROM conversation WHERE id=${ctx.peerId}`);

    if (ctx.messagePayload?.action === 'active_x100' && conv.owner == ctx.senderId) {
        
        let result = generate.generateNumber(1, 30);
        if (result >= 1 && result <= 14) result = "2x";
        if (result >= 13 && result <= 20) result = "3x";
        if (result >= 21 && result <= 25) result = "10x";
        if (result >= 26 && result <= 28) result = "15x";
        let random = (Math.random() * (5 - 1) + 1).toFixed(2);
        if(random >= 4.95 && random <= 5) result = "100x";

        let secret = generate.generateSecret(16);
        let hash = generate.hash.md5.create(`${secret}|${result}`);


        await postgresql.request(`UPDATE conversation SET gamemode='x100', result_text='${result}', secret='${secret}', hash='${hash}' WHERE id=${ctx.peerId}`)
        
        .then(() => {
            ctx.send({ 
                message: `🍂 Режим X100 активирован.\n\n🎲 Удачных игр!`,
                keyboard: keyboards.x100_keyboard
            });
        })
        .catch(e => console.log(e));
    }
};