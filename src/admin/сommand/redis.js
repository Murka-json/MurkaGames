const redis = require('../../../lib/redis/redis.js');

module.exports = async(ctx) => {
    const command = ctx.text?.split(" ");
    if(command[0] == '/redis') {
        if(command[1] == 'active') {
            redis.get("bot#settings").then((data) => {                
                redis.set("bot#settings", JSON.stringify({ newsender: false, active: JSON.parse(data).active ? false : true }));

                
                return ctx.send(`Бот успешно ${JSON.parse(data).active ? `выключен` : `включен`}`);
            });
        }
    }
};