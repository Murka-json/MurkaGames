/* eslint-disable no-unused-vars */
const utils = require("../../../lib/extensions/utils");
const settings = require('../../../configs/settings.json');
const helpers = require("../../../lib/redis/helper.js");
const postgresql = require('../../../lib/postgresql/postgresql.js');
const keyboards = require('../../../lib/extensions/keyboards.js');

module.exports = async (ctx) => {
    if (ctx.messagePayload?.action === "bank") {
        // Получаем данные беседы
        await postgresql.request(`SELECT * FROM conversation WHERE id=${ctx.peerId}`).then(async ([data]) => {
            if (data.gamemode == "wheel") {
                let bankText = `Да данный момент банк пуст...\n\n`;
                let bankAmount = 0;
                let bankLength = 0;

                let redText = ``;
                let redList = ``;

                let blackText = ``;
                let blackList = ``;

                let evenText = ``;
                let evenList = ``;

                let notevenText = ``;
                let notevenList = ``;

                let int112Text = ``;
                let int112List = ``;

                let int1324Text = ``;
                let int1324List = ``;

                let int2536Text = ``;
                let int2536List = ``;

                let numbersText = ``;
                let numbersList = ``;

                const betsData = await postgresql.request(`SELECT * FROM bets WHERE gameId=${ctx.peerId}`);
                for (let i in betsData) {
                    let currentBet = betsData[i];
                    bankLength++;
                    if (currentBet.type === "red") {
                        redText = "Ставки на красное:";
                        redList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "black") {
                        blackText = "Ставки на черное:";
                        blackList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "even") {
                        evenText = "Ставки на четное:";
                        evenList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKС\n`;
                    }
                    if (currentBet.type === "noteven") {
                        notevenText = "Ставки на нечетное:";
                        notevenList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "int112") {
                        int112Text = "Ставки на промежуток 1-12:";
                        int112List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "int1324") {
                        int1324Text = "Ставки на промежуток 13-24:";
                        int1324List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "int2536") {
                        int2536Text = "Ставки на промежуток 25-36:";
                        int2536List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type.split("#")[0] === "number") {
                        numbersText = "Ставки на числа:";
                        numbersList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC на число ${currentBet.type.split("#")[1]}\n`;
                    }
                    bankAmount += Number(currentBet.amount);
                    if (bankAmount > 0) bankText = `Всего поставлено: ${utils.format(bankAmount)} VKC`;
                }
                let betsList = `${redText}\n${redList}\n${blackText}\n${blackList}\n${evenText}\n${evenList}\n${notevenText}\n${notevenList}\n${int112Text}\n${int112List}\n${int1324Text}\n${int1324List}\n${int2536Text}\n${int2536List}\n${numbersText}\n${numbersList}`;
                bankText = `${bankText}\n\n${bankLength > settings.projectGameMaximalBankLength ? `Банк слишком длинный, отобразить его невозможно (количество: ${bankLength}).\n\nДождитесь окончения раунда, чтобы узнать результат ваших ставок\n` : betsList}\nХеш: ${data.hash}\nДо конца раунда: ${utils.time(data.time)}`;

                return ctx.send({
                    message: bankText
                });
            }


            if (data.gamemode == "x100") {
                let bankText = `Да данный момент банк пуст...\n\n`;
                let bankAmount = 0;
                let bankLength = 0;

                let x2Text = ``;
                let x2List = ``;

                let x3Text = ``;
                let x3List = ``;

                let x10Text = ``;
                let x10List = ``;

                let x15Text = ``;
                let x15List = ``;

                let x20Text = ``;
                let x20List = ``;

                let x100Text = ``;
                let x100List = ``;


                const betsData = await postgresql.request(`SELECT * FROM bets WHERE gameId=${ctx.peerId}`);
                for (let i in betsData) {
                    let currentBet = betsData[i];
                    bankLength++;
                    if (currentBet.type === "2x") {
                        x2Text = "Ставки на X2:";
                        x2List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "3x") {
                        x3Text = "Ставки на X3:";
                        x3List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "10x") {
                        x10Text = "Ставки на X10:";
                        x10List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKС\n`;
                    }
                    if (currentBet.type === "15x") {
                        x15Text = "Ставки на X15:";
                        x15List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "20x") {
                        x20Text = "Ставки на промежуток X20:";
                        x20List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "100x") {
                        x100Text = "Ставки на промежуток X100:";
                        x100List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }

                    bankAmount += Number(currentBet.amount);
                    if (bankAmount > 0) bankText = `Всего поставлено: ${utils.format(bankAmount)} VKC`;
                }
                let betsList = `${x2Text}\n${x2List}\n${x3Text}\n${x3List}\n${x10Text}\n${x10List}\n${x15Text}\n${x15List}\n${x20Text}\n${x20List}\n${x100Text}\n${x100List}`;
                bankText = `${bankText}\n\n${bankLength > settings.projectGameMaximalBankLength ? `Банк слишком длинный, отобразить его невозможно (количество: ${bankLength}).\n\nДождитесь окончения раунда, чтобы узнать результат ваших ставок\n` : betsList}\nХеш: ${data.hash}\nДо конца раунда: ${utils.time(data.time)}`;

                return ctx.send({
                    message: bankText
                });
            }



            if (data.gamemode == "dice") {
                // ? Рисуем косметические переменные
                let bankText = `Да данный момент банк пуст...\n\n`;
                let bankAmount = 0;
                let bankLength = 0;

                let evenText = ``;
                let evenList = ``;

                let notevenText = ``;
                let notevenList = ``;

                let numbersText = ``;
                let numbersList = ``;

                // ? Сортировка
                let gameBets = await postgresql.request(`SELECT * FROM bets WHERE gameId=${ctx.peerId}`).catch((err) => { throw err; });
                for (let i in gameBets) {
                    let currentBet = gameBets[i];
                    bankLength++;
                    if (currentBet.type === "even") {
                        evenText = "Ставки на четное:";
                        evenList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "noteven") {
                        notevenText = "Ставки на нечетное:";
                        notevenList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type.split("#")[0] === "number") {
                        numbersText = "Ставки на числа:";
                        numbersList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC на число ${currentBet.type.split("#")[1]}\n`;
                    }
                    bankAmount += Number(currentBet.amount);
                    if (bankAmount > 0) bankText = `Всего поставлено: ${utils.format(bankAmount)} VKC`;
                }
                let betsList = `${evenText}\n${evenList}\n${notevenText}\n${notevenList}\n${numbersText}\n${numbersList}`;
                bankText = `${bankText}\n\n${bankLength > settings.projectGameMaximalBankLength ? `Банк слишком длинный, невозможно отобразить столько ставок (количество: ${bankLength}). Все ставки на месте, дождись розыгрыша, чтоб узнать, выиграла ли твоя ставка или нет.\n` : betsList}\nХеш игры: ${data.hash}\nДо конца раунда: ${utils.time(data.time)}`;

                return ctx.send({
                    message: bankText
                });
            }

            if(data.gamemode == "litewheel") {
                // ? Рисуем косметические переменные
                let bankText = `Да данный момент банк пуст...\n\n`;
                let bankAmount = 0;
                let bankLength = 0;

                let redText = ``;
                let redList = ``;

                let blackText = ``;
                let blackList = ``;

                let int14Text = ``;
                let int14List = ``;

                let int58Text = ``;
                let int58List = ``;

                let int912Text = ``;
                let int912List = ``;

                let numbersText = ``;
                let numbersList = ``;

                // ? Сортировка
                let gameBets = await postgresql.request(`SELECT * FROM bets WHERE gameId=${ctx.peerId}`).catch((err) => { throw err; });
                for (let i in gameBets) {
                    let currentBet = gameBets[i];
                    bankLength++;
                    if (currentBet.type === "red") {
                        redText = "Ставки на красное:";
                        redList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "black") {
                        blackText = "Ставки на черное:";
                        blackList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }

                    if (currentBet.type === "int14") {
                        int14Text = "Ставки на на промежуток 1-4:";
                        int14List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }

                    if (currentBet.type === "int58") {
                        int58Text = "Ставки на на промежуток 5-8:";
                        int58List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }

                    if (currentBet.type === "int912") {
                        int912Text = "Ставки на промежуток 9-12:";
                        int912List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }

                    if (currentBet.type.split("#")[0] === "numbers") {
                        numbersText = "Ставки на числа:";
                        numbersList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC на число ${currentBet.type.split("#")[1]}\n`;
                    }

                    bankAmount += Number(currentBet.amount);
                    if (bankAmount > 0) bankText = `Всего поставлено: ${utils.format(bankAmount)} VKC`;
                }
                let betsList = `${redText}\n${redList}\n${blackText}\n${blackList}\n${int14Text}\n${int14List}\n${int58Text}\n${int58List}\n${int912Text}\n${int912List}\n${numbersText}\n${numbersText}`;
                bankText = `${bankText}\n\n${bankLength > settings.projectGameMaximalBankLength ? `Банк слишком длинный, невозможно отобразить столько ставок (количество: ${bankLength}). Все ставки на месте, дождись розыгрыша, чтоб узнать, выиграла ли твоя ставка или нет.\n` : betsList}\nХеш игры: ${data.hash}\nДо конца раунда: ${utils.time(data.time)}`;

                return ctx.send({
                    message: bankText
                });
            }

            if(data.gamemode == "orelreshka") {
                let bankText = `Да данный момент банк пуст...\n\n`;
                let bankAmount = 0;
                let bankLength = 0;

                let orelText = ``;
                let orelList = ``;

                let reshkaText = ``;
                let reshkaList = ``;

                let gameBets = await postgresql.request(`SELECT * FROM bets WHERE gameId=${ctx.peerId}`).catch((err) => { throw err; });
                for (let i in gameBets) {
                    let currentBet = gameBets[i];
                    bankLength++;
                    if (currentBet.type === "orel") {
                        orelText = "Ставки на выпадение орла:";
                        orelList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "reshka") {
                        reshkaText = "Ставки на выпадение решки:";
                        reshkaList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    bankAmount += Number(currentBet.amount);
                    if (bankAmount > 0) bankText = `Всего поставлено: ${utils.format(bankAmount)} VKC`;
                }

                let betsList = `${orelText}\n${orelList}\n\n${reshkaText}\n${reshkaList}`;
                bankText = `${bankText}\n\n${bankLength > settings.projectGameMaximalBankLength ? `Банк слишком длинный, невозможно отобразить столько ставок (количество: ${bankLength}). Все ставки на месте, дождись розыгрыша, чтоб узнать, выиграла ли твоя ставка или нет.\n` : betsList}\nХеш игры: ${data.hash}\nДо конца раунда: ${utils.time(data.time)}`;

                return ctx.send({
                    message: bankText
                });
            }


            if(data.gamemode == "double") {
                let bankText = `Да данный момент банк пуст...\n\n`;
                let bankAmount = 0;
                let bankLength = 0;

                let x2Text = ``;
                let x2List = ``;

                let x3Text = ``;
                let x3List = ``;

                let x5Text = ``;
                let x5List = ``;

                let x10Text = ``;
                let x10List = ``;

                // ? Сортировка
                let gameBets = await postgresql.request(`SELECT * FROM bets WHERE gameId=${ctx.peerId}`).catch((err) => { throw err; });
                for (let i in gameBets) {
                    let currentBet = gameBets[i];
                    bankLength++;
                    
                    if (currentBet.type === "x2") {
                        x2Text = "Ставки на X2:";
                        x2List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "x3") {
                        x3Text = "Ставки на X3:";
                        x3List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "x5") {
                        x5Text = "Ставки на X5:";
                        x5List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "x10") {
                        x10Text = "Ставки на X10:";
                        x10List += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    
                    bankAmount += Number(currentBet.amount);
                    if (bankAmount > 0) bankText = `Всего поставлено: ${utils.format(bankAmount)} VKC`;
                }
                let betsList = `${x2Text}\n${x2List}\n${x3Text}\n${x3List}\n${x5Text}\n${x5List}\n${x10Text}\n${x10List}`;
                bankText = `${bankText}\n\n${bankLength > settings.projectGameMaximalBankLength ? `Банк слишком длинный, невозможно отобразить столько ставок (количество: ${bankLength}). Все ставки на месте, дождись розыгрыша, чтоб узнать, выиграла ли твоя ставка или нет.\n` : betsList}\nХеш игры: ${data.hash}\nДо конца раунда: ${utils.time(data.time)}`;

                return ctx.send({
                    message: bankText
                });
            }


            if(data.gamemode == "down7up") {
                let bankText = `Да данный момент банк пуст...\n\n`;
                let bankAmount = 0;
                let bankLength = 0;

                let moreText = ``;
                let moreList = ``;

                let lessText = ``;
                let lessList = ``;

                let sevenText = ``;
                let sevenList = ``;

                // ? Сортировка
                let gameBets = await postgresql.request(`SELECT * FROM bets WHERE gameId=${ctx.peerId}`).catch((err) => { throw err; });
                for (let i in gameBets) {
                    let currentBet = gameBets[i];
                    bankLength++;
                    
                    if (currentBet.type === "less") {
                        lessText = "Ставки на Меньше 7:";
                        lessList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "more") {
                        moreText = "Ставки на Больше 7:";
                        moreList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    if (currentBet.type === "seven") {
                        sevenText = "Ставки на 7:";
                        sevenList += `${await helpers.getName(currentBet.playerid)} - ${utils.format(currentBet.amount)} VKC\n`;
                    }
                    
                    bankAmount += Number(currentBet.amount);
                    if (bankAmount > 0) bankText = `Всего поставлено: ${utils.format(bankAmount)} VKC`;
                }
                let betsList = `${lessText}\n${lessList}\n${moreText}\n${moreList}\n${sevenText}\n${sevenList}`;
                bankText = `${bankText}\n\n${bankLength > settings.projectGameMaximalBankLength ? `Банк слишком длинный, невозможно отобразить столько ставок (количество: ${bankLength}). Все ставки на месте, дождись розыгрыша, чтоб узнать, выиграла ли твоя ставка или нет.\n` : betsList}\nХеш игры: ${data.hash}\nДо конца раунда: ${utils.time(data.time)}`;

                return ctx.send({
                    message: bankText
                });
            }
        });
    }
};