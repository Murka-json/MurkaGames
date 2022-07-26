const { Keyboard } = require("vk-io");
const redis = require('../../../lib/redis/redis');

module.exports = async (ctx) => {
    if (ctx.messagePayload?.action === "settings") {
        await redis.get(`users.settings#${ctx.senderId}`).then((data) => {
            ctx.send({
                message: `⚙ Выберите ту настройку, которую желаете изменить`,
                keyboard: Keyboard.builder()
                    .textButton({ label: "Сменить ник", payload: { action: "edit_name" }, color: "primary" }).row()
                    .textButton({ label: "Кнопки ставок", payload: { action: "button_bets" }, color: JSON.parse(data).bets_button ? "positive" : "negative" }).row()
                    .textButton({ label: "Кликабельный никнейм", payload: { action: "click_nickname" }, color: JSON.parse(data).click_nickname ? "positive" : "negative" }).inline()
            });
        });
    }
};