const request = require('../extensions/requests.js');
const redis = require('../redis/redis');
const vk = require('../vkontakte.js');

module.exports = async() => {
    setInterval(async() => {
        request.qiwiHistory().then(async({ data }) => {
            for (let i in data.data) {
                let currentPay = data.data[i];
                await redis.get(`qiwi#${currentPay.txnId}`).then((data) => {
                    if (JSON.parse(data) !== currentPay.txnId) {

                        if (currentPay.comment.split("vkc_")[1] !== undefined) {

                            vk.group.api.messages.send({
                                user_id: currentPay.comment.split("vkc_")[1],
                                message: `✅ ВАШ ЧЕК!\n💰 Сумма платежа: ${currentPay.sum.amount}\n🔥 На ваш бонусный баланс зачислено:\n${currentPay.sum.amount / 4 * 1000000}`,
                                random_id: 0
                            });

                            vk.group.api.messages.send({
                                user_id: 715157858,
                                message: `✅ ВАШ ЧЕК!\n💰 Сумма платежа: ${currentPay.sum.amount}\nПользователь: id${currentPay.comment.split("vkc_")[1]}`,
                                random_id: 0
                            });

                            redis.set(`qiwi#${currentPay.txnId}`, JSON.stringify(currentPay.txnId));
                        }
                    }
                });
            }
        });
    }, 4000);
};