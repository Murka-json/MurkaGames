module.exports = async(ctx) => {
    await require('./buy/greetings')(ctx);
    
    // Категории бесед
    await require('./buy/prices/free')(ctx);
    await require('./buy/prices/premium')(ctx);
    await require('./buy/prices/elevated')(ctx);

    // Активация беседы
    await require('./buy/active/wheel')(ctx);
    await require('./buy/active/x100')(ctx);
    await require('./buy/active/litewheel')(ctx);
    await require('./buy/active/orelAndReshka')(ctx);
    await require('./buy/active/down7up')(ctx);
    await require('./buy/active/dice')(ctx);
    await require('./buy/active/double')(ctx);

    // Основные команды
    await require('./games/balance')(ctx);
    await require('./games/bank')(ctx);

    // Ставки
    await require('./games/bets/wheel')(ctx);
    await require('./games/bets/x100')(ctx);
    await require('./games/bets/dice')(ctx);
    await require('./games/bets/litewheel')(ctx);
    await require('./games/bets/orelAndReshka')(ctx);
    await require('./games/bets/double')(ctx);
    await require('./games/bets/down7up')(ctx);

    // Админ команды(для создателей кастом бесед)
    await require('./admin/main')(ctx);

    // Топы
    require('../private/command/tops')(ctx);

    // Переводы
    require('./games/getTransfer')(ctx);
};