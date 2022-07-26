const config = require('../../configs/config');

module.exports = (ctx) => {
    if (config.admins.includes(ctx.senderId)) {
        require('./сommand/postgresql')(ctx);
        require('./сommand/gamemode')(ctx);
        require('./сommand/redis')(ctx);
        require('./сommand/give')(ctx);
        require('./сommand/ungive')(ctx);
        require('./сommand/info')(ctx);
        require('./сommand/kick')(ctx);
    }
};