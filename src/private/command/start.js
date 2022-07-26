const { project } = require('../../../configs/config');
const keyboards   = require('../../../lib/extensions/keyboards.js');

module.exports = async(ctx) => {
    if(/Начать/i.test(ctx.text)) {
        ctx.send({
            message: `Добро пожаловать в ${project.project_name}! 💜`,
            keyboard: keyboards.menu_keyboard
        });
    }
};