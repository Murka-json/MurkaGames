const redis = require('../../lib/redis/redis');
const postgresql = require('../../lib/postgresql/postgresql.js');

module.exports = async(vk, ctx) => {
    const [data] = await vk.group.api.users.get({ user_id: ctx.senderId });

    await redis.get(`users.get#${ctx.senderId}`).then(async(user) => {
        if (!user) {
            await redis.set(`users.get#${ctx.senderId}`, JSON.stringify(data));
        }
    });

    await redis.get(`users.settings#${ctx.senderId}`).then(async(user) => {
        if (!user) {
            await redis.set(`users.settings#${ctx.senderId}`, JSON.stringify({callback_button: false, bets_button: true, click_nickname: false}));
        }
    });

    await postgresql.request(`INSERT INTO users(uid, name, balance, bbalance, win, winday, winclock, winweek, ref, button_bets, callback_button, click_nickname, referalbonus) VALUES(${ctx.senderId}, '${data.first_name}', 0, 0, 0, 0, 0, 0, ${!ctx.referralValue ? null : ctx.referralValue}, 1, 0, 0, ARRAY[${ctx.senderId}])`)
        .catch(err => {
            if (err.code != '23505') console.log(err);
        });
};