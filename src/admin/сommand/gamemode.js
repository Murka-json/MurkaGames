const postgresql = require('../../../lib/postgresql/postgresql');
const generate = require('../../../lib/extensions/generate.js');
const keyboards = require('../../../lib/extensions/keyboards.js');

module.exports = async (ctx) => {
    const command = ctx.text?.split(" ");

    if (command[0] == '/active') {

        if (command[1] == "wheel") {
            let result = generate.generateNumber(0, 36);
            let secret = generate.generateSecret(20);
            let hash = generate.hash.md5.create(`${secret}|${result}`);

            await postgresql.request(`UPDATE conversation SET gamemode='${command[1]}', secret='${secret}', result=${result}, hash='${hash}'`);
            return ctx.send({
                message: `🎲 Режим ${command[1]} активирован.`,
                keyboard: keyboards.wheel_keyboard
            });
        }


        if (command[1] == "x100") {
            let result = generate.generateNumber(1, 30);
            if (result >= 1 && result <= 14) result = "2x";
            if (result >= 13 && result <= 20) result = "3x";
            if (result >= 21 && result <= 25) result = "10x";
            if (result >= 26 && result <= 28) result = "15x";
            if (result >= 29 && result <= 30) result = "100x";

            let secret = generate.generateSecret(16);
            let hash = generate.hash.md5.create(`${secret}|${result}`);

            await postgresql.request(`UPDATE conversation SET gamemode='${command[1]}', secret='${secret}', result_text='${result}', hash='${hash}'`);
            return ctx.send({
                message: `🎲 Режим ${command[1]} активирован.`,
                keyboard: keyboards.x100_keyboard
            });
        }

        if (command[1] == "dice") {
            let result = generate.generateNumber(1, 6);
            let secret = generate.generateSecret(20);
            let hash = generate.hash.md5.create(`${secret}|${result}`);

            await postgresql.request(`UPDATE conversation SET gamemode='${command[1]}', secret='${secret}', result=${result}, hash='${hash}'`);
            return ctx.send({
                message: `🎲 Режим ${command[1]} активирован.`,
                keyboard: keyboards.dice_keyboard
            });
        }

        if (command[1] == "litewheel") {
            let result = generate.generateNumber(0, 12);
            let secret = generate.generateSecret(20);
            let hash = generate.hash.md5.create(`${secret}|${result}`);

            await postgresql.request(`UPDATE conversation SET gamemode='${command[1]}', secret='${secret}', result=${result}, hash='${hash}'`);
            return ctx.send({
                message: `🎲 Режим ${command[1]} активирован.`,
                keyboard: keyboards.lite_wheel
            });
        }

        if (command[1] == "orelreshka") {
            let result = generate.generateNumber(1, 2);

            if (result == 2) result = 'orel';
            if (result == 1) result = 'reshka';

            let secret = generate.generateSecret(20);
            let hash = generate.hash.md5.create(`${secret}|${result}`);

            await postgresql.request(`UPDATE conversation SET gamemode='${command[1]}', secret='${secret}', result_text='${result}', hash='${hash}'`);
            return ctx.send({
                message: `🎲 Режим ${command[1]} активирован.`,
                keyboard: keyboards.orel_and_reshka
            });
        }


        if (command[1] == "double") {
            let result = generate.generateNumber(1, 25);
            if (result >= 1 && result <= 10) result = "x2";
            if (result >= 11 && result <= 17) result = "x3";
            if (result >= 18 && result <= 23) result = "x5";
            if (result >= 24 && result <= 25) result = "x10";

            let secret = generate.generateSecret(16);

            let hash = generate.hash.md5.create(`${secret}|${result}`);

            await postgresql.request(`UPDATE conversation SET gamemode='${command[1]}', secret='${secret}', result_text='${result}', hash='${hash}'`);
            return ctx.send({
                message: `🎲 Режим ${command[1]} активирован.`,
                keyboard: keyboards.double_keyboard
            });
        }

        if(command[1] == "down7up") {

            let result = generate.generateNumber(2, 12);
            let secret = generate.generateSecret(16);
            let hash = generate.hash.md5.create(`${secret}|${result}`);

            await postgresql.request(`UPDATE conversation SET gamemode='${command[1]}', secret='${secret}', result_text='${result}', hash='${hash}'`);
            return ctx.send({
                message: `🎲 Режим ${command[1]} активирован.`,
                keyboard: keyboards.down_7_up_keyboard
            });
        }
    }
};