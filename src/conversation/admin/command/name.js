const postgresql = require('../../../../lib/postgresql/postgresql.js');
const vk = require('../../../../lib/vkontakte.js');

module.exports = async(ctx) => {
    const command = ctx.text.split(" ");
    const name = ctx.text.split("/имя")[1];
    if(command[0] === "/имя") {
        await postgresql.request(`SELECT * FROM conversation WHERE id=${ctx.peerId}`).then(async([data]) => {
            
            if(data.owner != ctx.senderId) return ctx.send(`Эта команда не для тебя, друг...`);
            
            // Тупа проверки
            if(!name) return ctx.send(`Вы не указали имени`);
            if(name.length > 12) return ctx.send(`Максимальное кол-во символов в названии - 8`);
            if(name.length < 3) return ctx.send(`Минимальное кол-во символов в названии - 3`);
            // Изменяем название беседы в вк
            await vk.group.api.messages.editChat({ 
                chat_id: ctx.peerId - 2000000000, 
                title: name 
            });

            await postgresql.request(`UPDATE conversation SET name='${name}'`).then(() => {
                return ctx.send(`Вы успешно изменили имя беседы на ${name}`);
            }).catch(() => {
                ctx.send(`Произошла ошибка при изменении имени беседы, пожалуйста, повторите еще раз.`);
            });
        });
    }
};