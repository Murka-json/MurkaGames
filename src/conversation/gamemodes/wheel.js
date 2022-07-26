/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const vk = require('../../../lib/vkontakte.js');
const utils = require('../../../lib/extensions/utils.js');
const generate = require('../../../lib/extensions/generate');
const postgresql = require('../../../lib/postgresql/postgresql.js');
const helper = require('../../../lib/postgresql/helpers.js');
const settings = require('../../../configs/settings.json');
const path = require('path');

const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

const evenNumbers = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];
const notevenNumbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35];

const int112Numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const int1324Numbers = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const int2526Numbers = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];


module.exports = () => {
    try {
        setInterval(async () => {
            let gameList = {};
            await postgresql.request(`SELECT * FROM conversation WHERE gamemode='wheel'`).then(async (data) => {
                for (let i in data) {
                    let currentData = data[i];
                    gameList[currentData.id] = {
                        ...currentData,
                        bets: await postgresql.request(`SELECT * FROM bets WHERE gameid=${currentData.id}`).catch((err) => console.log(err))
                    };
                }
            }).catch(err => console.log(err));
    
    
            for (let i in gameList) {
                let currentGame = gameList[i];
                // Списываем каждую секунду у таймера(пизда сколько запросов я ебал)
                if (currentGame.bets.length > 0) {
                    currentGame.time -= 1;
                    await postgresql.request(`UPDATE conversation SET time=time-1 WHERE id=${currentGame.id}`).catch(err => console.log(err));
                }
    
                // Делаем проверку на таймер
                if (currentGame.time <= 0) {
                    currentGame.result = Number(currentGame.result);
    
                    let resultType = "зелёное";
                    if (redNumbers.includes(currentGame.result)) resultType = "красное";
                    if (blackNumbers.includes(currentGame.result)) resultType = "черное";
    
                    let ratingData = {};
                    let resultText = `Выпало число ${currentGame.result}, ${resultType}\n\n`;
    
                    for (let d in currentGame.bets) {
                        let currentBet = {
                            ...currentGame.bets[d],
                            topAmount: 0
                        };
                        if (!ratingData[currentBet.playerid]) {
                            ratingData[currentBet.playerid] = {
                                id: currentBet.playerid,
                                gameid: currentBet.gameid,
                                topAmount: 0
                            };
                        }
                        // Вот тут полная ебля бля...
                        console.log(currentBet.playerid);
                        if (currentBet.type === "red") {
                            let save = Date.now();
                            if (redNumbers.includes(currentGame.result)) {
                                resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на красное выиграла (+${utils.format(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.colors)})\n`;
                                ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.colors - currentBet.amount);
                                
                                let topCoins = Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.colors);
                                await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.colors)}) WHERE uid=${currentBet.playerid}`).then((data) => { console.log(Date.now() - save, "ms"); }).catch((err) => { throw err; });
                            } else {
                                ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                                resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на красное проиграла\n`;
                            }
                        }
                        // ? Черное
                        if (currentBet.type === "black") {
                            let save = Date.now();
                            if (blackNumbers.includes(currentGame.result)) {
                                resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на черное выиграла (+${utils.format(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.colors)})\n`;
                                ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.colors - currentBet.amount);
                                
                                let topCoins = Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.colors);
                                await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.colors)}) WHERE uid=${currentBet.playerid}`).then((data) => { console.log(Date.now() - save, "ms"); }).catch((err) => { throw err; });
                            } else {
                                ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                                resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на черное проиграла\n`;
                            }
                        }
    
    
    
                        //? Четное
                        if (currentBet.type === "even") {
                            let save = Date.now();
                            if (evenNumbers.includes(currentGame.result)) {
                                resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на четное выиграла (+${utils.format(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.parity)})\n`;
                                ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.parity - currentBet.amount);
                                
                                let topCoins = Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.parity);
                                await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.parity)}) WHERE uid=${currentBet.playerid}`).then((data) => { console.log(Date.now() - save, "ms"); }).catch((err) => { throw err; });
                            } else {
                                ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                                resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на четное проиграла\n`;
                            }
                        }

                        // ? Нечетное
                        if (currentBet.type === "noteven") {
                            let save = Date.now();
                            if (notevenNumbers.includes(currentGame.result)) {
                                resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на нечетное выиграла (+${utils.format(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.parity)})\n`;
                                ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.parity - currentBet.amount);
                                
                                let topCoins = Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.parity);
                                await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.parity)}) WHERE uid=${currentBet.playerid}`).then((data) => { console.log(Date.now() - save, "ms"); }).catch((err) => { throw err; });
                            } else {
                                ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                                resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на нечетное проиграла\n`;
                            }
                        }
    
    
                        // ? Промежуток 1-12
                        if (currentBet.type === "int112") {
                            let save = Date.now();
                            if (int112Numbers.includes(currentGame.result)) {
                                resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на промежуток 1-12 выиграла (+${utils.format(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.intervals)})\n`;
                                ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.intervals - currentBet.amount);
                                
                                let topCoins = Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.intervals);
                                await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.intervals)}) WHERE uid=${currentBet.playerid}`).then((data) => { console.log(Date.now() - save, "ms"); }).catch((err) => { throw err; });
                            } else {
                                ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                                resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на промежуток 1-12 проиграла\n`;
                            }
                        }
                        // ? Промежуток 13-24
                        if (currentBet.type === "int1324") {
                            let save = Date.now();
                            if (int1324Numbers.includes(currentGame.result)) {
                                resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на промежуток 13-24 выиграла (+${utils.format(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.intervals)})\n`;
                                ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.intervals - currentBet.amount);
                               
                                let topCoins = Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.intervals);
                                await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.intervals)}) WHERE uid=${currentBet.playerid}`).then((data) => { console.log(Date.now() - save, "ms"); }).catch((err) => { throw err; });
                            } else {
                                ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                                resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на промежуток 13-24 проиграла\n`;
                            }
                        }
                        // ? Промежуток 25-36
                        if (currentBet.type === "int2536") {
                            let save = Date.now();
                            if (int2526Numbers.includes(currentGame.result)) {
                                resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на промежуток 25-36 выиграла (+${utils.format(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.intervals)})\n`;
                                ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.intervals - currentBet.amount);
                                let topCoins = Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.intervals);
                                
                                await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.intervals)}) WHERE uid=${currentBet.playerid}`).then((data) => { console.log(Date.now() - save, "ms"); }).catch((err) => { throw err; });
                            } else {
                                ratingData[currentBet.playerid].topAmount -= Math.floor(currentBet.amount);
                                resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на промежуток 25-36 проиграла\n`;
                            }
                        }
    
    
                        // ? Числа
                        if (currentBet.type.split("#")[0] === "number") {
                            let save = Date.now();
                            if (Number(currentBet.type.split("#")[1]) === currentGame.result) {
                                resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на число ${Number(currentBet.type.split("#")[1])} выиграла (+${utils.format(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.numbers)})\n`;
                                ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.numbers - currentBet.amount);
                                
                                let topCoins = Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.numbers);
                                await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * settings.projectGamesSettings.projectGamesWheelSettings.defaultCoefficient.numbers)}) WHERE uid=${currentBet.playerid}`).then((data) => { console.log(Date.now() - save, "ms"); }).catch((err) => { throw err; });
                            } else {
                                ratingData[currentBet.playerid].topAmount += Math.floor(currentBet.amount);
                                resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на число ${Number(currentBet.type.split("#")[1])} проиграла\n`;
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
                            value: path.resolve(__dirname, `./pictures/wheel/${currentGame.result}.jpg`)
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
    
                    
                    await postgresql.request(`DELETE FROM bets WHERE gameid=${currentGame.id}`).catch((err) => { throw err; });
                    let result = generate.generateNumber(0, 36);
                    let secret = generate.generateSecret(20);
                    let hash = generate.hash.md5.create(`${secret}|${result}`);

                    const [ gameData ] = await postgresql.request(`SELECT * FROM conversation WHERE id=${currentGame.id}`);
                    await postgresql.request(`UPDATE conversation SET hash='${hash}', secret='${secret}', result=${result}, time=${gameData.state_timer} WHERE id=${currentGame.id}`).catch((err) => { throw err; });
                }
            }
        }, 1000);
    } catch (e) {
        console.log(e);
    }
};