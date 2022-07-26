/* eslint-disable no-useless-escape */
// const vk = require('../../lib/vkontakte.js');

// Кастомный чат менеджер автоматизирующий работу администраторов
module.exports = async(ctx) => {
    let component = ctx.text.split(" ");
    for(let i = 0; i < component.length; i++) {

        if (/^(https?:\/\/)?([а-я0-9_-]{1,32}|[a-z0-9_-]{1,32})\.([а-я0-9_-]{1,8}|[a-z0-9_-]\S{1,8})$/.test(component[i])) {
            return ctx.send(`Сообщение с ссылкой было удалено.`);
        }
    
        if (/^(http:\/\/|https:\/\/)?(www.)?(vk\.com|vkontakte\.ru)\/(id\d|[a-zA-Z0-9_.])+$/.test(component[i])) {
            return ctx.send(`Сообщение с ссылкой было удалено.`);
        }
    
        if (/^(https?:\/\/)?(www\.)?vk\.cc\/(\w|\d)+?\/?$/.test(component[i])) {
            return ctx.send(`Сообщение с ссылкой было удалено.`);
        }

    }

};