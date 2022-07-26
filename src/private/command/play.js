const { Keyboard } = require('vk-io');

module.exports = (ctx) => {
    if(ctx.messagePayload?.action === "play") {
        return ctx.send({ 
            message: `🔥 Выбирай скорее и вперёд играть!`,
            keyboard: Keyboard.builder()
                .urlButton({ label: "Wheel", url: `https://vk.me/join/AJQ1d3CT_SHRjk2EpPulEjS3` })
                .urlButton({ label: "Dice", url: `https://vk.me/join/AJQ1d9JwRiKMuDvlkwcJ6XXM` })
                .urlButton({ label: "LiteWheel", url: `https://vk.me/join/AJQ1d1xNOyLoP/RZmFICi8pN` }).row()

                .urlButton({ label: "Double", url: `https://vk.me/join/AJQ1dxCxHCLodPbrtkcFNFTz` })
                .urlButton({ label: "Орёл и Решка", url: `https://vk.me/join/AJQ1d6brLSLgoPvOPw_V87Uv` })
                .urlButton({ label: "Down7Up", url: `https://vk.me/join/AJQ1dzbEZyLaFVh8I6pFxY92` }).row()

                .urlButton({ label: "X100", url: `https://vk.me/join/AJQ1d6h8WiKnv/hIfp2XIqdN` }).row().inline()
        });
    }
};