const postgresql = require('../../../lib/postgresql/postgresql.js');
const helper = require('../../../lib/redis/helper');
const vk = require('../../../lib/vkontakte.js');
const utils = require('../../../lib/extensions/utils.js');
const path = require('path');
const generate = require('../../../lib/extensions/generate');

// ? Параметры игры
const evenNumbers = [2, 4, 6];
const notevenNumbers = [1, 3, 5];

module.exports = async() => {
    setInterval(async () => {
        let gamesList = {};
        await postgresql.request(`SELECT * FROM conversation WHERE gamemode='dice'`).then(async (data) => {
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
                    // ? Четное
                    if (currentBet.type === "even") {
                        if (evenNumbers.includes(currentGame.result)) {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на четное выиграла (+${utils.format(currentBet.amount * 1.9)})\n`;

                            let topCoins = Math.floor(currentBet.amount * 1.9);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}),  balance=round(balance+${Math.floor(currentBet.amount * 1.9)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на четное проиграла\n`;
                        }
                    }
                    // ? Нечетное
                    if (currentBet.type === "noteven") {
                        if (notevenNumbers.includes(currentGame.result)) {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на нечетное выиграла (+${utils.format(currentBet.amount * 1.9)})\n`;

                            let topCoins = Math.floor(currentBet.amount * 1.9);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 1.9)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
                        } else {
                            resultText += `❌ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на нечетное проиграла\n`;
                        }
                    }
                    // ? Числа
                    if (currentBet.type.split("#")[0] === "number") {
                        if (Number(currentBet.type.split("#")[1]) === currentGame.result) {
                            resultText += `✅ ${await helper.getName(currentBet.playerid)} ставка ${utils.format(currentBet.amount)} на число ${Number(currentBet.type.split("#")[1])} выиграла (+${utils.format(currentBet.amount * 5.5)})\n`;

                            let topCoins = Math.floor(currentBet.amount * 5.5);
                            await postgresql.request(`UPDATE users SET win=round(win+${topCoins}), winday=round(winday+${topCoins}), winclock=round(winclock+${topCoins}), winweek=round(winweek+${topCoins}), balance=round(balance+${Math.floor(currentBet.amount * 5.5)}) WHERE uid=${currentBet.playerid}`).catch((err) => { throw err; });
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
                        value: path.resolve(__dirname, `./pictures/dice/${currentGame.result}.jpg`)
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

                let result = generate.generateNumber(1, 6);
                let secret = generate.generateSecret(16);
                let hash = generate.hash.md5.create(`${secret}|${result}`);

                await postgresql.request(`UPDATE conversation SET hash='${hash}', secret='${secret}', result=${result}, time=60 WHERE id=${currentGame.id}`).catch((err) => { throw err; });
            }
        }
    }, 1000);
};