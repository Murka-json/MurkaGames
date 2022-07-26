/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const vk = require('../../../lib/vkontakte.js');
const utils = require('../../../lib/extensions/utils.js');
const generate = require('../../../lib/extensions/generate');
const postgresql = require('../../../lib/postgresql/postgresql.js');
const helper = require('../../../lib/redis/helper.js');
const settings = require('../../../configs/settings.json');
const path = require('path');

let down_numbers = [2, 3, 4, 5, 6];
let up_numbers = [8, 9, 10, 11, 12];

module.exports = async () => {
    setInterval(async () => {
        let gamesList = {};
        await postgresql.request(`SELECT * FROM conversation WHERE gamemode='down7up'`).then(async (data) => {
            for (let i in data) {
                let currentData = data[i];
                gamesList[currentData.id] = {
                    ...currentData,
                    bets: await postgresql.request(`SELECT * FROM bets WHERE gameId=${currentData.id}`).catch((err) => { throw err; })
                };
            }
        }).catch((err) => { throw err; });



        for (let i in gamesList) {
            let currentGame = gamesList[i];
            let type = null;

            // Проверка для красоты
            if (currentGame.result == 2) type = '1 и 1';
            if (currentGame.result == 3) type = '1 и 2';
            if (currentGame.result == 4) type = '1 и 3';
            if (currentGame.result == 5) type = '2 и 3';
            if (currentGame.result == 6) type = '2 и 4';
            if (currentGame.result == 7) type = '1 и 6';
            if (currentGame.result == 8) type = '2 и 6';
            if (currentGame.result == 9) type = '3 и 6';
            if (currentGame.result == 10) type = '5 и 5';
            if (currentGame.result == 11) type = '5 и 6';
            if (currentGame.result == 12) type = '6 и 6';


            // ? Таймер
            if (currentGame.bets.length > 0) {
                currentGame.time -= Number(1);
                await postgresql.request(`UPDATE conversation SET time=time-1 WHERE id=${currentGame.id}`);
            }
            if (currentGame.time < 1) {
                let ratingData = {};
                let resultText = `Выпали числа ${type}, результат: ${currentGame.result}\n\n`;
                for (let d in currentGame.bets) {
                    let currentBet = {
                        ...currentGame.bets[d],
                        topAmount: Number(0)
                    };
                    if (!ratingData[currentBet.playerid]) {
                        ratingData[currentBet.playerid] = {
                            id: currentBet.playerid,
                            gameId: currentBet.gameId,
                            topAmount: Number(0)
                        };
                    }

                    // ? Орёл
                    if (currentBet.type === "less") {
                        if (down_numbers.includes(currentGame.result)) {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на Меньше 7 выиграла (+${utils.format(currentBet.amount * 2)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 2 - currentBet.amount);

                            let topCoins = Math.floor(currentBet.amount * 2);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 2)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на Меньше 7 проиграла\n`;
                        }
                    }

                    // ? Решка
                    if (currentBet.type === "seven") {
                        if (currentGame.result == 7) {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на 7 выиграла (+${utils.format(currentBet.amount * 5)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 5 - currentBet.amount);

                            let topCoins = Math.floor(currentBet.amount * 5);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 5)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на 7 проиграла\n`;
                        }
                    }

                    if (currentBet.type === "more") {
                        if (up_numbers.includes(currentGame.result)) {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на Меньше 7 выиграла (+${utils.format(currentBet.amount * 2)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 2 - currentBet.amount);

                            let topCoins = Math.floor(currentBet.amount * 2);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 2)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на Меньше 7 проиграла\n`;
                        }
                    }


                }

                resultText += `\n\nХэш игры: ${currentGame.hash}\nПроверка честности: ${currentGame.secret}|${currentGame.result}`;
                vk.group.api.messages.send({
                    peer_id: currentGame.id,
                    message: "Итак, результаты раунда...",
                    random_id: Date.now()
                }).catch((err) => { throw err; });

                vk.group.upload.messagePhoto({
                    source: {
                        value: path.resolve(__dirname, `./pictures/down7up/${currentGame.result}.jpg`)
                    }
                }).then((attachment) => {
                    vk.group.api.messages.send({
                        peer_id: currentGame.id,
                        message: resultText,
                        attachment,
                        random_id: Math.floor(Date.now() * Math.random())
                    }).then(() => {
                        vk.group.api.messages.send({
                            peer_id: currentGame.id,
                            message: `Здесь может быть ваша реклама`,
                            random_id: 0
                        });
                    });
                });

                await postgresql.request(`DELETE FROM bets WHERE gameId='${currentGame.id}'`).catch((err) => { throw err; });

                let result = generate.generateNumber(2, 12);
                let secret = generate.generateSecret(16);
                let hash = generate.hash.md5.create(`${secret}|${result}`);


                await postgresql.request(`UPDATE conversation SET hash='${hash}', secret='${secret}', result=${result}, time=60 WHERE id=${currentGame.id}`);
            }
        }
    }, 1000);
};