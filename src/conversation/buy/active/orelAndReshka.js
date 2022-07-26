/* eslint-disable no-unused-vars */
const postgresql = require('../../../../lib/postgresql/postgresql.js');
const generate = require('../../../../lib/extensions/generate.js');
const keyboards = require('../../../../lib/extensions/keyboards.js');

module.exports = async (ctx) => {
    const [conv] = await postgresql.request(`SELECT * FROM conversation WHERE id=${ctx.peerId}`);

    if (ctx.messagePayload?.action === 'active_orel_and_reshka' && conv.owner == ctx.senderId) {

        let result = generate.generateNumber(1, 2);
        let secret = generate.generateSecret(20);
        let hash = generate.hash.md5.create(`${secret}|${result}`);

        let result_text = (result == 1 ? 'orel' : 'reshka');

        await postgresql.request(`UPDATE conversation SET gamemode='orelreshka', secret='${secret}', result=${result}, result_text='${result_text}' hash='${hash}'`)
            
        .then(() => {
                ctx.send({
                    message: `🍂 Режим Орёл и Решка активирован.\n\n🎲 Удачных игр!`,
                    keyboard: keyboards.orel_and_reshka
                });
            })
            .catch(e => console.log(e));
    }
};