
module.exports = async(ctx) => {
        await require('./command/name')(ctx);
        await require('./command/timer')(ctx);
};