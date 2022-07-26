

module.exports = async(ctx) => {
    await require('./command/start')(ctx);
    await require('./command/tops')(ctx);
    await require('./command/profile')(ctx);
    await require('./command/listTops')(ctx);
    await require('./command/play')(ctx);
    await require('./command/topConv')(ctx);
    await require('./command/settings')(ctx);
    await require('./command/referal')(ctx);
    await require('./command/setSettings')(ctx);
};