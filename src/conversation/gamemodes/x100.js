/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const vk = require('../../../lib/vkontakte.js');
const utils = require('../../../lib/extensions/utils.js');
const generate = require('../../../lib/extensions/generate');
const postgresql = require('../../../lib/postgresql/postgresql.js');
const helper = require('../../../lib/redis/helper.js');
const settings = require('../../../configs/settings.json');
const path = require('path');



module.exports = async() => {
    setInterval(async () => {
        let gamesList = {};
        await postgresql.request(`SELECT * FROM conversation WHERE gamemode='x100'`).then(async (data) => {
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
                    if (currentBet.type === "2x") {
                        if (currentGame.result_text === "2x") {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент x2 выиграла (+${utils.format(currentBet.amount * 2)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 2 - currentBet.amount);
                            
                            let topCoins = Math.floor(currentBet.amount * 2);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 2)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент x2 проиграла\n`;
                        }
                    }
                    // ? x3
                    if (currentBet.type === "3x") {
                        if (currentGame.result_text === "3x") {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент x3 выиграла (+${utils.format(currentBet.amount * 3)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 3 - currentBet.amount);
                            
                            let topCoins = Math.floor(currentBet.amount * 3);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 3)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент x3 проиграла\n`;
                        }
                    }
                    // ? x10
                    if (currentBet.type === "10x") {
                        if (currentGame.result_text === "10x") {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент x10 выиграла (+${utils.format(currentBet.amount * 10)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 10 - currentBet.amount);
                            
                            let topCoins = Math.floor(currentBet.amount * 10);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 10)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент x10 проиграла\n`;
                        }
                    }

                    // ? x15
                    if (currentBet.type === "15x") {
                        if (currentGame.result_text === "15x") {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент x15 выиграла (+${utils.format(currentBet.amount * 15)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 15 - currentBet.amount);
                            
                            let topCoins = Math.floor(currentBet.amount * 15);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 15)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент x15 проиграла\n`;
                        }
                    }

                    // ? x20
                    if (currentBet.type === "20x") {
                        if (currentGame.result_text === "20x") {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент x20 выиграла (+${utils.format(currentBet.amount * 20)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 20 - currentBet.amount);
                            
                            let topCoins = Math.floor(currentBet.amount * 20);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 20)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент x20 проиграла\n`;
                        }
                    }

                    // ? x100
                    if (currentBet.type === "100x") {
                        if (currentGame.result_text === "100x") {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент x100 выиграла (+${utils.format(currentBet.amount * 100)})\n`;
                            ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * 100 - currentBet.amount);
                            
                            let topCoins = Math.floor(currentBet.amount * 100);
                            await postgresql.request(`UPDATE conversation SET win=round(${topCoins}) WHERE id=${currentGame.id}`);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 100)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на коэффициент x100 проиграла\n`;
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
                        value: path.resolve(__dirname, `./pictures/x100/${currentGame.result_text}.jpg`)
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
                    
                    let result = generate.generateNumber(1, 49);
                    if (result >= 1 && result <= 30) result = "2x";
                    if (result >= 31 && result <= 42) result = "3x";
                    if (result >= 43 && result <= 45) result = "10x";
                    if (result >= 46 && result <= 48) result = "15x";
                    
                    let random = (Math.random() * (5 - 1) + 1).toFixed(2);
                    if(random >= 4.95 && random <= 5) result = "100x";

                    let secret = generate.generateSecret(16);
                    let hash = generate.hash.md5.create(`${secret}|${result}`);

                    await postgresql.request(`UPDATE conversation SET hash='${hash}', secret='${secret}', result_text='${result}', time=60 WHERE id=${currentGame.id}`).catch((err) => { throw err; });
                }
        }
        }, 1000);
};