/* eslint-disable no-unused-vars */
const postgresql = require('../../../../lib/postgresql/postgresql.js');
const settings = require('../../../../configs/settings.json');
const helper = require('../../../../lib/redis/helper');
const { Keyboard } = require('vk-io');
const utils = require('../../../../lib/extensions/utils.js');
const config = require('../../../../configs/config.js');
const redis = require('../../../../lib/redis/redis.js');

module.exports = async (ctx) => {
    if (ctx.messagePayload?.action.split("@")[0] === 'wheel') {
        let [{ time }] = await postgresql.request(`SELECT time FROM conversation WHERE id=${ctx.peerId}`);
        if (time < 5) {
            return ctx.send(`До конца раунда осталось менее 5-ти секунд`);
        }

        let [userData] = await postgresql.request(`SELECT * FROM users WHERE uid=${ctx.senderId}`);
        let betType = ctx.messagePayload?.action.split("@")[1];
        let betAmount = 0;
        if (betType === 'numbers') {
            betType = await ctx.question(`${await helper.getName(ctx.senderId)}, На какое число желаете поставить? (от 0 до 36)`);
            if (isNaN(betType.text) || betType.text > 36 || betType.text < 0) return;
            betType = `numbers#${Math.floor(betType.text)}`;
        }

        const limit_bets = await postgresql.request(`SELECT * FROM bets WHERE playerid=${ctx.senderId}`);

        for (let i in limit_bets) {
            let currentBets = limit_bets[i];
            if (betType == "noteven" && currentBets.type == 'even') return ctx.send(`${await helper.getName(ctx.senderId)}, Вы уже поставили ставку на другую сторону`);
            if (betType == "even" && currentBets.type == 'noteven') return ctx.send(`${await helper.getName(ctx.senderId)}, Вы уже поставили ставку на другую сторону`);

            if (betType == "black" && currentBets.type == 'red') return ctx.send(`${await helper.getName(ctx.senderId)}, Вы уже поставили ставку на другую сторону`);
            if (betType == "red" && currentBets.type == 'black') return ctx.send(`${await helper.getName(ctx.senderId)}, Вы уже поставили ставку на другую сторону`);
        }

        let scale = Number(Number(userData.balance) + Number(userData.bbalance));

        let data = await redis.get(`users.settings#${ctx.senderId}`);
        if (JSON.parse(data).bets_button) {
            betAmount = await ctx.question({
                message: `${await helper.getName(ctx.senderId)}, Введите сумму ставки на ${betType.split("#")[0] == 'numbers' ? `число ${betType.split("#")[1]}` : settings.games.wheel[betType]} или нажмите на кнопку:`,
                keyboard: Keyboard.builder()
                    .textButton({ label: `${utils.format(scale)}`, color: "positive" }).row()
                    .textButton({ label: `${utils.format(scale / 2)}`, color: "secondary" }).row()
                    .textButton({ label: `${utils.format(scale / 4)}`, color: "secondary" }).inline()
            });
        } else {
            betAmount = await ctx.question(`${await helper.getName(ctx.senderId)}, Введите сумму ставки на ${betType.split("#")[0] == 'numbers' ? `число ${betType.split("#")[1]}` : settings.games.wheel[betType]}:`);
        }
        // Обновляем данные игрока(вдруг новый перевод или че нить еще)
        [userData] = await postgresql.request(`SELECT * FROM users WHERE uid=${ctx.senderId}`).catch((err) => { throw err; });

        let lenght = 0;
        for (let i in betAmount.messagePayload) { lenght++; }
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

        // На всякий случай, без лишних вопросов пж...
        [userData] = await postgresql.request(`SELECT * FROM users WHERE uid=${ctx.senderId}`).catch((err) => { throw err; });

        // Иди нахуй, хули я перед тобой тут распинаюсь, пишу то, что хочу и попробуй возразить сука
        let [gameData] = await postgresql.request(`SELECT * FROM conversation WHERE id=${ctx.peerId}`);
        if (gameData.gamemode !== "wheel") return;

        // Чекаем минимальную ставку
        if (betAmount.text < settings.minBetsAmount) {
            return ctx.send(`${await helper.getName(ctx.senderId)}, минимальная ставка - ${utils.format(settings.minBetsAmount)} VKC`);
        }
        // Чекаем баланс
        if (Number(scale) < Number(betAmount.text)) {
            return ctx.send(`${await helper.getName(ctx.senderId)}, тебе не хватает ${utils.format(betAmount.text - Number(scale))} VKC`);
        }
        let needToTake = Number(betAmount.text) - Number(userData.balance);
        if (Number(scale) >= Number(betAmount.text)) {
            // Снятие основного баланса
            if (Number(userData.balance) >= Number(Number(betAmount.text))) {
                await postgresql.request(`UPDATE users SET balance=round(balance-${Number(betAmount.text)}, 0) WHERE uid=${ctx.senderId}`).catch((err) => { throw err; });
            }
            // Снятие бонусного баланса 
            else if (Number(userData.bbalance) >= Number(Number(betAmount.text))) {
                await postgresql.request(`UPDATE users SET bbalance=round(bbalance-${Number(betAmount.text)}, 0) WHERE uid=${ctx.senderId}`).catch((err) => { throw err; });
            }
            // Смешивание балансов
            else if (Number(userData.bbalance) >= needToTake) {
                await postgresql.request(`UPDATE users SET balance=round(balance-balance, 0), bbalance=round(bbalance-${Number(needToTake)}, 0) WHERE uid=${ctx.senderId}`).catch((err) => { throw err; });
            }
        }

        // ? Записываем ставку
        let betsList = await postgresql.request(`SELECT * FROM bets WHERE gameId=${ctx.peerId} AND type='${(betType.split('#')[0] === "numbers" ? `number#${betType.split('#')[1]}` : betType)}' AND playerId='${ctx.senderId}'`).catch((err) => { throw err; });
        if (betsList.length === 1) {
            await postgresql.request(`UPDATE bets SET amount=round(amount+${betAmount.text}, 0) WHERE playerid=${betsList[0].playerid}`).catch((err) => { throw err; });
        } else {
            await postgresql.request(`INSERT INTO bets (gameId, playerId, type, amount) VALUES ('${ctx.peerId}', '${ctx.senderId}', '${(betType.split('#')[0] === "numbers" ? `number#${betType.split('#')[1]}` : betType)}', '${Number(betAmount.text)}')`).catch((err) => { throw err; });
        }

        // Записываем на баланс администратору беседы
        await postgresql.request(`UPDATE users SET balance=round(balance+${betAmount.text / 100 * gameData.procent}) WHERE uid=${gameData.owner}`);

        // ? Отправляем сообщение
        ctx.send({
            message: `${await helper.getName(ctx.senderId)}, успешная ставка ${utils.format(betAmount.text)} VKC на ${(betType.split('#')[0] === "numbers" ? `${settings.games.wheel[betType.split('#')[0]]} ${betType.split('#')[1]}` : settings.games.wheel[betType])}`
        });

        require('../../../backspin/event/wheel')(ctx, ctx.senderId, betType, betAmount.text);
    }
};