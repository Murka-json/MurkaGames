const crypto = require('crypto');
const random = require("./random.js");
const generator = new random();

module.exports = {
    hash: {
        md5: {
            create: (string) => {
                return crypto.createHash("md5").update(String(string)).digest("hex");
            }
        },

        sha256: {
            create: (string) => {
                return crypto.createHash("sha256").update(String(string)).digest("hex");
            }
        }
    },

    generateNumber: (min, max) => {
        let rand = min - 0.5 + generator.random_incl() * (max - min + 1);
        return Math.round(rand);
    },

    generateSecret: (length) => {
        let result = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(generator.random_incl() * charactersLength)
          );
        }
        return result;
    },
    
    floatNumber: (min, max) => {
        let rand = max ? generator.random_incl() * (max - min) + min : Math.round(generator.random_incl() * min);
        return Number(rand);
    }
};