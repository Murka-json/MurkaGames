const postgresql = require('../../../lib/postgresql/postgresql.js');
const helper = require('../../../lib/redis/helper');
const vk = require('../../../lib/vkontakte.js');
const utils = require('../../../lib/extensions/utils.js');
const path = require('path');
const generate = require('../../../lib/extensions/generate');

// ? Параметры игры
const redNumbers = [1, 3, 5, 7, 9, 12];
const blackNumbers = [2, 4, 6, 8, 10, 11];

const evenNumbers = [2, 4, 6, 8, 10, 12 ];

const int14Numbers = [1, 2, 3, 4];
const int58Numbers = [5, 6, 7, 8];
const int912Numbers = [9, 10, 11, 12];


module.exports = async() => {
    setInterval(async () => {
        let gamesList = {};
        await postgresql.request(`SELECT * FROM conversation WHERE gamemode='litewheel'`).then(async (data) => {
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
                currentGame.result = Number(currentGame.result);
                let ratingData = {};
                let resultText = `Выпало число ${currentGame.result}, ${evenNumbers.includes(currentGame.result) ? "четное" : "нечетное"}\n\n`;
                for (let d in currentGame.bets) {
                    let currentBet = {
                        ...currentGame.bets[d],
                        topAmount: Number(0)
                    };
                    if (!ratingData[currentBet.playerid]) {
                        ratingData[currentBet.playerid] = {
                            id: currentBet.playerid,
                            topAmount: Number(0)
                        };
                    }


                    if (currentBet.type === "int14") {
                        if (int14Numbers.includes(currentGame.result)) {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на промежуток 1-4 выиграла (+${utils.format(currentBet.amount * 3)})\n`;

                            let topCoins = Math.floor(currentBet.amount * 3);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}),  balance=round(balance+${Math.floor(currentBet.amount * 3)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на промежуток 1-4  проиграла\n`;
                        }
                    }
                    // ? Нечетное
                    if (currentBet.type === "int58") {
                        if (int58Numbers.includes(currentGame.result)) {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на промежуток 5-8 выиграла (+${utils.format(currentBet.amount * 3)})\n`;

                            let topCoins = Math.floor(currentBet.amount * 3);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 3)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на промежуток 5-8 проиграла\n`;
                        }
                    }

                    if (currentBet.type === "int912") {
                        if (int912Numbers.includes(currentGame.result)) {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на промежуток 9-12 выиграла (+${utils.format(currentBet.amount * 3)})\n`;

                            let topCoins = Math.floor(currentBet.amount * 3);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 3)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на промежуток 9-12 проиграла\n`;
                        }
                    }

                    // ? Четное
                    if (currentBet.type === "red") {
                        if (redNumbers.includes(currentGame.result)) {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на красное выиграла (+${utils.format(currentBet.amount * 2)})\n`;

                            let topCoins = Math.floor(currentBet.amount * 2);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}),  balance=round(balance+${Math.floor(currentBet.amount * 2)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на красное проиграла\n`;
                        }
                    }
                    // ? Нечетное
                    if (currentBet.type === "black") {
                        if (blackNumbers.includes(currentGame.result)) {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на черное выиграла (+${utils.format(currentBet.amount * 2)})\n`;

                            let topCoins = Math.floor(currentBet.amount * 2);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 2)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на черное проиграла\n`;
                        }
                    }
                    // ? Числа
                    if (currentBet.type.split("#")[0] === "number") {
                        if (Number(currentBet.type.split("#")[1]) === currentGame.result) {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на число ${Number(currentBet.type.split("#")[1])} выиграла (+${utils.format(currentBet.amount * 12)})\n`;

                            let topCoins = Math.floor(currentBet.amount * 12);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 12)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
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
                        // eslint-disable-next-line no-undef
                        value: path.resolve(__dirname, `./pictures/litewheel/${currentGame.result}.jpg`)
                    }
                }).then((attachment) => {
                    vk.group.api.messages.send({
                        peer_id: currentGame.id,
                        message: resultText,
                        attachment,
                        random_id: Math.floor(Date.now() * Math.random())
                    }).then(() => {
                        // ? Новостное сообщение
                        console.log(currentGame);
                    }).catch((err) => { throw err; });
                }).catch((err) => { throw err; });

                await postgresql.request(`DELETE FROM bets WHERE gameId='${currentGame.id}'`).catch((err) => { throw err; });

                let result = generate.generateNumber(1, 12);
                let secret = generate.generateSecret(16);
                let hash = generate.hash.md5.create(`${secret}|${result}`);

                await postgresql.request(`UPDATE conversation SET hash='${hash}', secret='${secret}', result=${result}, time=60 WHERE id=${currentGame.id}`).catch((err) => { throw err; });
            }
        }
    }, 1000);
};