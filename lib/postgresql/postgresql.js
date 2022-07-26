/* eslint-disable no-async-promise-executor */
const { Client } = require('pg');
const config = require('../../configs/config.js');

const db = new Client(config.postgres);

db
    .connect()
    .then(() => console.log(`PostgreSQL connected`))
    .catch((err) => console.log(err));


module.exports.request = (sql) => {
    return new Promise(async (resolve, reject) => {
        await db.query(sql).then((res) => {
            resolve(res.rows);
        }).catch((err) => {
            reject(err);
        });
    });
};
