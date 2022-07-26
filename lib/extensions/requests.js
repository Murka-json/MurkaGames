/* eslint-disable no-async-promise-executor */
const axios = require('axios');
const config = require('../../configs/config');

module.exports = {
    qiwiHistory: async () => {
        return new Promise(async (resolve) => {
            await axios.get(`https://edge.qiwi.com/payment-history/v2/persons/+${config.qiwi.qiwi_number}/payments?`, {
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + config.qiwi.qiwi_key
                },
                params: {
                    rows: 10,
                    operation: 'IN',
                    sources: 'QW_RUB'
                }
            }).then((data) => {
                resolve(data);
            });
        });
    },


    qiwiBalance: async () => {
        return new Promise(async (resolve) => {
            await axios.get(`https://edge.qiwi.com/funding-sources/v2/persons/+${config.qiwi.qiwi_number}/accounts`, {
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + config.qiwi.qiwi_key
                }
            }).then((data) => {
                resolve(data);
            });
        });
    }
};