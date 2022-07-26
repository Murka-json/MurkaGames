/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const vk = require('../../../lib/vkontakte.js');
const utils = require('../../../lib/extensions/utils.js');
const generate = require('../../../lib/extensions/generate');
const postgresql = require('../../../lib/postgresql/postgresql.js');
const helper = require('../../../lib/redis/helper.js');
const settings = require('../../../configs/settings.json');
const path = require('path');



module.exports = async () => {
    setInterval(async () => {
        let gamesList = {};
        await postgresql.request(`SELECT * FROM conversation WHERE gamemode='orelreshka'`).then(async (data) => {
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
            // ? Таймер
            if (currentGame.bets.length > 0) {
                currentGame.time -= Number(1);
                await postgresql.request(`UPDATE conversation SET time=time-1 WHERE id=${currentGame.id}`);
            }
            if (currentGame.time < 1) {
                let ratingData = {};
                let resultText = `Выпавшая сторона монеты: ${currentGame.result_text == 'orel' ? `Орёл` : `Решка`}\n\n`;
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
                    if (currentBet.type === "orel") {
                        if (currentGame.result_text === "orel") {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на Орла выиграла (+${utils.format(currentBet.amount * 2)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 2 - currentBet.amount);

                            let topCoins = Math.floor(currentBet.amount * 2);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 2)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на Орла проиграла\n`;
                        }
                    }

                    // ? Решка
                    if (currentBet.type === "reshka") {
                        if (currentGame.result_text === "reshka") {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на Решку выиграла (+${utils.format(currentBet.amount * 2)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 2 - currentBet.amount);

                            let topCoins = Math.floor(currentBet.amount * 2);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 2)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на Решку проиграла\n`;
                        }
                    }


                }

                resultText += `\n\nХэш игры: ${currentGame.hash}\nПроверка честности: ${currentGame.secret}|${currentGame.result_text}`;
                vk.group.api.messages.send({
                    peer_id: currentGame.id,
                    message: "Итак, результаты раунда...",
                    random_id: Date.now()
                }).catch((err) => { throw err; });

                vk.group.upload.messagePhoto({
                    source: {
                        value: path.resolve(__dirname, `./pictures/orel_and_reshka/${currentGame.result_text}.jpg`)
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

                let result = generate.generateNumber(1, 2);
                if(result == 2) result = 'orel';
                if(result == 1)  result = 'reshka';

                let secret = generate.generateSecret(20);
                let hash = generate.hash.md5.create(`${secret}|${result}`);


                await postgresql.request(`UPDATE conversation SET hash='${hash}', secret='${secret}', result_text='${result}', time=60 WHERE id=${currentGame.id}`);
            }
        }
    }, 1000);
};