/* eslint-disable no-async-promise-executor */
const redis = require('./redis');


module.exports = {
    getName: async (userId) => {
        return new Promise(async (resolve) => {
            await redis.get(`users.get#${userId}`).then(async (data) => {
                await redis.get(`users.settings#${userId}`).then((r) => {
                    if (JSON.parse(r).click_nickname) {
                        resolve(`[id${JSON.parse(data).id}|${JSON.parse(data).first_name}]`);
                    } else {
                        resolve(`${JSON.parse(data).first_name}`);
                    }
                });
            });
        });
    }
};