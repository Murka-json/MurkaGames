const postgresql = require('../../../lib/postgresql/postgresql.js');

module.exports = (ctx) => {
    const command = ctx.text.split(" ");


    if(command[0] == "/stats") {
        return ctx.send(``);
    }
};