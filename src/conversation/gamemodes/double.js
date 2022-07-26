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
        await postgresql.request(`SELECT * FROM conversation WHERE gamemode='double'`).then(async (data) => {
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
                let resultText = `Выпавший коэффициент равен ${currentGame.result_text}\n\n`;
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
                    // ? x2
                    if (currentBet.type === "x2") {
                        if (currentGame.result_text === "x2") {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент X2 выиграла (+${utils.format(currentBet.amount * 2)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 2 - currentBet.amount);

                            let topCoins = Math.floor(currentBet.amount * 2);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 2)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент X2 проиграла\n`;
                        }
                    }
                    // ? x3
                    if (currentBet.type === "x3") {
                        if (currentGame.result_text === "x3") {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент X3 выиграла (+${utils.format(currentBet.amount * 3)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 3 - currentBet.amount);

                            let topCoins = Math.floor(currentBet.amount * 3);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 3)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент X3 проиграла\n`;
                        }
                    }

                    // ? x5
                    if (currentBet.type === "x5") {
                        if (currentGame.result_text === "x5") {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент X5 выиграла (+${utils.format(currentBet.amount * 5)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 5 - currentBet.amount);

                            let topCoins = Math.floor(currentBet.amount * 5);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 5)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент X3 проиграла\n`;
                        }
                    }

                    // ? x10
                    if (currentBet.type === "x10") {
                        if (currentGame.result_text === "x10") {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент X10 выиграла (+${utils.format(currentBet.amount * 10)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 10 - currentBet.amount);

                            let topCoins = Math.floor(currentBet.amount * 10);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 10)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент X10 проиграла\n`;
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
                        value: path.resolve(__dirname, `./pictures/double/${currentGame.result_text}.jpg`)
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

                let result = generate.generateNumber(1, 28);
                if (result >= 1 && result <= 12) result = "x2";
                if (result >= 13 && result <= 21) result = "x3";
                if (result >= 22 && result <= 26) result = "x5";
                if (result >= 27 && result <= 28) result = "x10";

                let secret = generate.generateSecret(16);
                let hash = generate.hash.md5.create(`${secret}|${result}`);

                await postgresql.request(`UPDATE conversation SET hash='${hash}', secret='${secret}', result_text='${result}', time=60 WHERE id=${currentGame.id}`).catch((err) => { throw err; });
            }
        }
    }, 1000);
};