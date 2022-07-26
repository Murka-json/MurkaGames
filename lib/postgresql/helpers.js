/* eslint-disable no-async-promise-executor */
const postgresql = require('./postgresql');


module.exports = {
    getName: async (id) => {
        return new Promise(async (resolve) => {
            await postgresql.request(`SELECT name FROM users WHERE uid='${id}'`).then(data => {
                resolve(`${data[0].name}`);
            }).catch(err => {
                console.log(err);
            });
        });
    },

    getConvName: async (id) => {
        return new Promise(async (resolve) => {
            await postgresql.request(`SELECT name FROM conversation WHERE id='${id}'`).then(data => {
                resolve(`${data[0].name}`);
            }).catch(err => {
                console.log(err);
            });
        });
    }
};