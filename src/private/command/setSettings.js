/* eslint-disable no-unused-vars */
const redis = require('../../../lib/redis/redis.js');
const vk = require('../../../lib/vkontakte.js');

module.exports = async (ctx) => {
    const [data] = await vk.group.api.users.get({ user_id: ctx.senderId });

    await redis.get(`users.settings#${ctx.senderId}`).then(async(data) => {
        
        if (ctx.messagePayload?.action === "button_bets") {
            if (JSON.parse(data).bets_button) {
                
                redis.set(`users.settings#${ctx.senderId}`, JSON.stringify({ 
                    data, 
                    callback_button: JSON.parse(data).callback_button, 
                    bets_button: false, 
                    click_nickname: JSON.parse(data).click_nickname 
                }));
                ctx.send(`🎉 Отлично! С данного момента ваши кнопки ставок неактивны.`);
            } else {
                
                redis.set(`users.settings#${ctx.senderId}`, JSON.stringify({ 
                    data, 
                    callback_button: JSON.parse(data).callback_button, 
                    bets_button: true, 
                    click_nickname: JSON.parse(data).bets_button 
                }));
                ctx.send(`🎉 Отлично! С данного момента ваши кнопки ставок активны.`);
            }
        }

        if (ctx.messagePayload?.action === "callback_button") {
            if (JSON.parse(data).callback_button) {
                
                redis.set(`users.settings#${ctx.senderId}`, JSON.stringify({ 
                    data, 
                    callback_button: false, 
                    bets_button: JSON.parse(data).bets_button, 
                    click_nickname: JSON.parse(data).click_nickname 
                }));
                ctx.send(`🎉 Отлично! С данного момента у вас неактивны Callback-кнопки.`);
            } else {
                
                redis.set(`users.settings#${ctx.senderId}`, JSON.stringify({ 
                    data, 
                    callback_button: true, 
                    bets_button: JSON.parse(data).bets_button, 
                    click_nickname: JSON.parse(data).click_nickname 
                }));
                ctx.send(`🎉 Отлично! С данного момента у вас активны Callback-кнопки.\n\nВнимание! Это работает лишь на официальных клиента ВК`);
            }
        }

        if (ctx.messagePayload?.action === "click_nickname") {
            if (JSON.parse(data).click_nickname) {
                
                redis.set(`users.settings#${ctx.senderId}`, JSON.stringify({ 
                    callback_button: JSON.parse(data).callback_button, 
                    bets_button: JSON.parse(data).bets_button, 
                    click_nickname: false 
                }));
                ctx.send(`🎉 Отлично! С данного момента ваши никнейм или имя не кликабельны.`);
            } else {
                
                redis.set(`users.settings#${ctx.senderId}`, JSON.stringify({ 
                    callback_button: JSON.parse(data).callback_button, 
                    bets_button: JSON.parse(data).bets_button,  
                    click_nickname: true 
                }));
                ctx.send(`🎉 Отлично! С данного момента ваши никнейм или имя кликабельны.`);
            }
        }
    });

    await redis.get(`users.get#${ctx.senderId}`).then(async(data) => {
        let [ user_info ] = await vk.group.api.users.get({ user_ids: ctx.senderId });

        if(ctx.messagePayload?.action === "edit_name") {
            let name = await ctx.question(`Введите новый никнейм...`);

            if(name.text.length > 8) {
                return ctx.send(`🛑 Никнейм не должен содержать более 8-ми символов`);
            }

            if(name.text.length < 1) {
                return ctx.send(`🛑 Никнейм не должен содержать менее 1 символа`);
            }

            let info = {
                id: user_info.id,
                first_name: name.text,
                last_name: user_info.last_name
            };
            
        await redis.set(`users.get#${ctx.senderId}`, JSON.stringify(info)).then(() => {
            return ctx.send(`🧿 Вы успешно изменили никнейм на: ${name.text}`);
        }).catch(() => {
            return ctx.send(`🛑 При смене никнейма произошла ошибка. Попробуйте еще раз или введите другой.`);
        });

        }
    });
};