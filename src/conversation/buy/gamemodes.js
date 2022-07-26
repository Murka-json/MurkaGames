const keyboards = require('../../../lib/extensions/keyboards.js');


module.exports = (ctx) => {
    ctx.send({
        message: `😉 Теперь стоит определится с режимом для вашей беседы!`,
        keyboard: keyboards.modes_keyboard
});
};