/* eslint-disable no-unused-vars */
const { Keyboard } = require('vk-io');
const postgresql = require('../../../../lib/postgresql/postgresql.js');
const helper = require('../../../../lib/redis/helper.js');
const utils = require('../../../../lib/extensions/utils.js');
const settings = require('../../../../configs/settings.json');
const config = require('../../../../configs/config.js');
const redis = require('../../../../lib/redis/redis.js');

module.exports = async (ctx) => {
    if (ctx.messagePayload?.action.split("@")[0] === "orel|reshka") {

        let [{ time }] = await postgresql.request(`SELECT time FROM conversation WHERE id=${ctx.peerId}`);

        if (time < 5) {
            return ctx.send(`До конца раунда осталось менее 5-ти секунд`);
        }

        let betType = ctx.messagePayload.action.split("@")[1]; // Ставка

        let [betsYou] = await postgresql.request(`SELECT * FROM bets WHERE playerid=${ctx.senderId}`);
    
        if(betType == 'orel' && betsYou?.type == 'reshka') return ctx.send(`${await helper.getName(ctx.senderId)}, нельзя поставить на выпадение двух сторон монеты!`);
        if(betType == 'reshka' && betsYou?.type == 'orel') return ctx.send(`${await helper.getName(ctx.senderId)}, нельзя поставить на выпадение двух сторон монеты!`);
    

        let [userData] = await postgresql.request(`SELECT * FROM users WHERE uid=${ctx.senderId}`).catch((err) => console.log(err));
        let betAmount = null;
        let scale = Number(Number(userData.balance) + Number(userData.bbalance));

        let data = await redis.get(`users.settings#${ctx.senderId}`);

        if (JSON.parse(data).bets_button) {
            betAmount = await ctx.question(`${await helper.getName(ctx.senderId)}, введи сумму ставки на ${settings.games.orelandreshka[betType]} или нажми на кнопку:`, {
                keyboard: Keyboard.builder()
                    .textButton({ label: `${utils.format((scale) / 1)}`, color: "positive" }).row()
                    .textButton({ label: `${utils.format((scale) / 2)}` }).row()
                    .textButton({ label: `${utils.format((scale) / 4)}` }).inline()
            });
        } else {
            betAmount = await ctx.question(`${await helper.getName(ctx.senderId)}, введи сумму ставки на ${settings.games.orelandreshka[betType]}:`);
        }

        [userData] = await postgresql.request(`SELECT * FROM users WHERE uid=${ctx.senderId}`).catch((err) => { throw err; });


        let lenght = 0;
        for (let i in betAmount.messagePayload) {
            lenght++;
        }
        if (lenght > 0) return;

        betAmount.text = utils.text(betAmount.text);
        let message = betAmount.text == null ? '' : betAmount.text;
        let noti = message.split('] ');
        if (message[0] == '[' && noti[0].split('|').length == 2 && (noti[0].split('|')[0] == `[club` + config.project.project_bot_id || noti[0].split('|')[0] == `[public` + config.project.project_bot_id)) {
            noti.splice(0, 1);
            betAmount.text = noti.join('] ');
            // eslint-disable-next-line no-useless-escape
            betAmount.text = betAmount.text.replace(/(\ |\,)/ig, '');
        }
        if (['вб', 'вабанк'].includes(betAmount.text.toLowerCase())) betAmount.text = String(scale);
        if (betAmount.text?.toLowerCase().endsWith('к') || betAmount.text?.toLowerCase().endsWith('k')) {
            let colva = ((betAmount.text.match(/к|k|K|К/g) || []).length);
            betAmount.text = betAmount.text.replace(/к/g, '');
            betAmount.text = betAmount.text.replace(/К/g, '');
            betAmount.text = betAmount.text.replace(/K/g, '');
            betAmount.text = betAmount.text.replace(/k/g, '');
            betAmount.text = betAmount.text * Math.pow(1000, colva);
        }

        if (betAmount.text < 1 || isNaN(betAmount.text)) return;
        betAmount.text = Math.floor(betAmount.text);

        [userData] = await postgresql.request(`SELECT * FROM users WHERE uid=${ctx.senderId}`).catch((err) => { throw err; });

        // ? Обновляем данные беседы :/
        let [gameData] = await postgresql.request(`SELECT * FROM conversation WHERE id=${ctx.peerId}`).catch((err) => { throw err; });
        if (gameData.gamemode !== "orelreshka") return;

        if (betAmount.text < settings.minBetsAmount) {
            return ctx.send(`${await helper.getName(ctx.senderId)}, минимальная ставка - ${utils.format(settings.minBetsAmount)} VKC`);
        }

        if (scale < betAmount.text) {
            return ctx.send(`${await helper.getName(ctx.senderId)}, тебе не хватает ${utils.format(betAmount.text - scale)} VKC`);
        }

        let needToTake = betAmount.text - userData.balance;
        if (scale >= betAmount.text) {

            // Снятие бонусного баланса 
            if (userData.bbalance >= betAmount.text) {
                await postgresql.request(`UPDATE users SET bbalance=round(bbalance-${Number(betAmount.text)}, 0) WHERE uid=${ctx.senderId}`).catch((err) => { throw err; });
            }
            // Снятие основного баланса
            else if (userData.balance >= betAmount.text) {
                await postgresql.request(`UPDATE users SET balance=round(balance-${Number(betAmount.text)}, 0) WHERE uid=${ctx.senderId}`).catch((err) => { throw err; });
            }
            // Смешивание балансов
            else if (userData.bbalance >= needToTake) {
                await postgresql.request(`UPDATE users SET balance=round(balance-balance, 0), bbalance=round(bbalance-${Number(needToTake)}, 0) WHERE uid=${ctx.senderId}`).catch((err) => { throw err; });
            }
        }
        // ? Записываем ставку
        let betsList = await postgresql.request(`SELECT * FROM bets WHERE gameId=${ctx.peerId} AND type='${betType}' AND playerId=${ctx.senderId}`).catch((err) => { throw err; });
        if (betsList.length === 1) {
            await postgresql.request(`UPDATE bets SET amount=round(amount+${betAmount.text}, 0) WHERE playerid=${betsList[0].playerid}`).catch((err) => { throw err; });
        } else {
            await postgresql.request(`INSERT INTO bets (gameId, playerId, type, amount) VALUES ('${ctx.peerId}', '${ctx.senderId}', '${betType}', '${Number(betAmount.text)}')`).catch((err) => { throw err; });
        }

        // Записываем на баланс администратору беседы
        await postgresql.request(`UPDATE users SET balance=round(balance+${betAmount.text / 100 * gameData.procent}) WHERE uid=${gameData.owner}`);


        // ? Отправляем сообщение
        ctx.send({
            message: `${await helper.getName(ctx.senderId)}, успешная ставка ${utils.format(betAmount.text)} VKC ${settings.games.orelandreshka[betType]}`
        });

        require('../../../backspin/event/orelAndReshka')(ctx, ctx.senderId, betType, betAmount.text);
    }
};