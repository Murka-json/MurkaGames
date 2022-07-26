const postgresql = require('../../../lib/postgresql/postgresql.js');

module.exports = async (ctx) => {
    const command = ctx.text?.split(" ");
    if (command[0] == "/sql") {
        const request = ctx.text.split("/sql")[1];
        console.log(request);
        await postgresql.request(request).then((data) => {
            ctx.send(`${data}`);
        }).catch((err) => {
           ctx.send(`${err}`);
        });
    }
};