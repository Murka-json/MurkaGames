/* eslint-disable no-undef */
const postgresql = require('../../lib/postgresql/postgresql.js');
const { referalBonus } = require('../../configs/settings.json');
const utils = require('../../lib/extensions/utils');
const vk = require('../../lib/vkontakte.js');

function Referal(data, text, refbal, data2) {
    postgresql.request(`UPDATE users SET referalbonus[${data.referalbonus.length + 1}] = ${data2.uid} where uid = ${data.uid}`);
    vk.group.api.messages.send({
        peer_id: data.uid,
        message: text,
        random_id: 0
    });
    postgresql.request(`UPDATE users SET bbalance = ${data.bbalance + refbal} where uid = ${data.uid}`);
}

module.exports = async() => {
    setInterval(async() => {
        await postgresql.request(`SELECT * FROM users`).then(async(data) => {
            data.map(async(res) => {
                if (res.ref) {
                    await postgresql.request(`SELECT * FROM users WHERE uid = ${res.ref}`).then(async(ower) => {
                        ower.map((rep) => {
                            if (res.referalbonus.indexOf(rep.uid) < 0 && rep.referalbonus.indexOf(res.uid) < 0) {
                                Referal(res,
                                    `Вы перешли по реферальной ссылке [id${rep.uid}|${rep.name}], вы получили - ${utils.toKformat(referalBonus.referalUserTransition)} VKC на бонусный баланс.`,
                                    referalBonus.referalUserTransition,
                                    rep
                                );
                                Referal(rep,
                                    `[id${res.uid}|${res.name}], Перешел по вашей реферальной ссылке, вы получили: ${utils.toKformat(referalBonus.referalUserOwner)} VKC на бонусный баланс. 🎁`,
                                    referalBonus.referalUserOwner,
                                    res
                                );
                            }
                        });
                    });
                }
            });
        });
    }, 5000);
};