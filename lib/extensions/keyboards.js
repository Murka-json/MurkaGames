const { Keyboard } = require('vk-io');
const { vkcoin } = require('../../configs/config.js');

module.exports = {
    menu_keyboard: Keyboard.builder()
        .textButton({ label: "Найти беседу", payload: { action: "play", type: "private" }, color: "positive" }).row()

        .textButton({ label: "Профиль", payload: { action: "getProfile", type: "private" }, color: "primary" })
        .textButton({ label: "Настройки", payload: { action: "settings", type: "private" }, color: "primary" }).row()

        .urlButton({ label: "Пополнить", payload: { action: "replenish" }, url: `https://vk.com/coin#x${vkcoin.vkcoin_private_user_id}_1000_${vkcoin.vkcoin_transer_payload}_1` })
        .textButton({ label: "Вывести", payload: { action: "withdraw", type: "private" }, color: "secondary" }).row()

        .textButton({ label: "Промокоды", payload: { action: "promocodes", type: "private" }, color: "primary" })
        .textButton({ label: "Реферальная система", payload: { action: "referalSystem", type: "private" }, color: "primary" }).row()

        .textButton({ label: "Топы", payload: { action: "tops", type: "private" }, color: "negative" }).row()
        .textButton({ label: "Купить VkCoin", payload: { action: "buy_coins", type: "private" }, color: "positive" })

    ,

    tops_keyboard: Keyboard.builder()
        .textButton({ label: "Топ Часа", payload: { action: "getTop@winclock" }, color: "primary" }).row()
        .textButton({ label: "Топ Дня", payload: { action: "getTop@winday" }, color: "primary" }).row()
        .textButton({ label: "Топ Недели", payload: { action: "getTop@winweek" }, color: "primary" }).row()
        .textButton({ label: "Топ игроков", payload: { action: "getTop@win" }, color: "primary" }).row()
        .textButton({ label: "Топ Бесед", payload: { action: "convTop@winconvs" }, color: "positive" }).inline()

    ,

    category_сonv_keyboard: Keyboard.builder()
        .textButton({ label: "Бесплатная 1%", payload: { action: "free_conversation" }, color: "negative" }).row()
        .textButton({ label: "Повышенная 2%", payload: { action: "elevated_conversation" }, color: "primary" }).row()
        .textButton({ label: "Премиум 3%", payload: { action: "premium_conversation" }, color: "positive" }).row()

    ,

    modes_keyboard: Keyboard.builder()
        .textButton({ label: "Wheel", payload: { action: "active_wheel" }, color: "positive" })
        .textButton({ label: "Dice", payload: { action: "active_dice" }, color: "positive" }).row()
        .textButton({ label: "Down7Up", payload: { action: "active_down7up" }, color: "positive" })
        .textButton({ label: "Lite Wheel", payload: { action: "active_lite" }, color: "positive" }).row()
        .textButton({ label: "Double", payload: { action: "active_double" }, color: "positive" })
        .textButton({ label: "Орёл и Решка", payload: { action: "active_orel_and_reshka" }, color: "positive" }).row()
        .textButton({ label: "X100", payload: { action: "active_x100" }, color: "positive" }).row().inline()


    ,


    wheel_keyboard: Keyboard.builder()
        .textButton({ label: "Банк", payload: { action: "bank" }, color: "positive" })
        .textButton({ label: "Баланс", payload: { action: "balance" }, color: "positive" }).row()

        .textButton({ label: "Чётное", payload: { action: "wheel@even" }, color: "secondary" })
        .textButton({ label: "Нечётное", payload: { action: "wheel@noteven" }, color: "secondary" }).row()

        .textButton({ label: "1-12", payload: { action: "wheel@int112" }, color: "secondary" })
        .textButton({ label: "13-24", payload: { action: "wheel@int1324" }, color: "secondary" })
        .textButton({ label: "25-36", payload: { action: "wheel@int2536" }, color: "secondary" }).row()

        .textButton({ label: "Красное", payload: { action: "wheel@red" }, color: "secondary" })
        .textButton({ label: "На число", payload: { action: "wheel@numbers" }, color: "secondary" })
        .textButton({ label: "Чёрное", payload: { action: "wheel@black" }, color: "secondary" }).row()

        .urlButton({ label: "Пополнить", payload: { action: "replenish" }, url: `https://vk.com/coin#x${vkcoin.vkcoin_private_user_id}_1000_${vkcoin.vkcoin_transer_payload}_1` })
        .textButton({ label: "Вывести", payload: { action: "withdraw" }, color: "secondary" }).row()


    ,


    x100_keyboard: Keyboard.builder()
        .textButton({ label: "Банк", payload: { action: "bank" }, color: "positive" })
        .textButton({ label: "Баланс", payload: { action: "balance" }, color: "positive" }).row()

        .textButton({ label: "2x", payload: { action: "x100@2x" }, color: "secondary" })
        .textButton({ label: "3x", payload: { action: "x100@3x" }, color: "secondary" })
        .textButton({ label: "10x", payload: { action: "x100@10x" }, color: "secondary" }).row()

        .textButton({ label: "15x", payload: { action: "x100@15x" }, color: "secondary" })
        .textButton({ label: "20x", payload: { action: "x100@20x" }, color: "secondary" })
        .textButton({ label: "100x", payload: { action: "x100@100x" }, color: "secondary" }).row()

        .urlButton({ label: "Пополнить", payload: { action: "replenish" }, url: `https://vk.com/coin#x${vkcoin.vkcoin_private_user_id}_1000_${vkcoin.vkcoin_transer_payload}_1` })
        .textButton({ label: "Вывести", payload: { action: "withdraw" }, color: "secondary" }).row()


    ,


    dice_keyboard: Keyboard.builder()
        .textButton({ label: "Банк", payload: { action: "bank" }, color: "positive" })
        .textButton({ label: "Баланс", payload: { action: "balance" }, color: "positive" }).row()

        .textButton({ label: "1", payload: { action: "dice@1" }, color: "secondary" })
        .textButton({ label: "2", payload: { action: "dice@2" }, color: "secondary" })
        .textButton({ label: "3", payload: { action: "dice@3" }, color: "secondary" }).row()

        .textButton({ label: "4", payload: { action: "dice@4" }, color: "secondary" })
        .textButton({ label: "5", payload: { action: "dice@5" }, color: "secondary" })
        .textButton({ label: "6", payload: { action: "dice@6" }, color: "secondary" }).row()

        .textButton({ label: "Четное", payload: { action: "dice@even" }, color: "primary" })
        .textButton({ label: "Нечетное", payload: { action: "dice@noteven" }, color: "primary" }).row()

        .urlButton({ label: "Пополнить", payload: { action: "replenish" }, url: `https://vk.com/coin#x${vkcoin.vkcoin_private_user_id}_1000_${vkcoin.vkcoin_transer_payload}_1` })
        .textButton({ label: "Вывести", payload: { action: "withdraw" }, color: "secondary" }).row()


    ,

    lite_wheel: Keyboard.builder()
        .textButton({ label: "Банк", payload: { action: "bank" }, color: "positive" })
        .textButton({ label: "Баланс", payload: { action: "balance" }, color: "positive" }).row()

        .textButton({ label: "Красное", payload: { action: "litewheel@red" }, color: "primary" })
        .textButton({ label: "На число", payload: { action: "litewheel@numbers" }, color: "positive" })
        .textButton({ label: "Черное", payload: { action: "litewheel@black" }, color: "primary" }).row()

        .textButton({ label: "1-4", payload: { action: "litewheel@int14" }, color: "secondary" })
        .textButton({ label: "5-8", payload: { action: "litewheel@int58" }, color: "secondary" })
        .textButton({ label: "9-12", payload: { action: "litewheel@int912" }, color: "secondary" }).row()

        .urlButton({ label: "Пополнить", payload: { action: "replenish" }, url: `https://vk.com/coin#x${vkcoin.vkcoin_private_user_id}_1000_${vkcoin.vkcoin_transer_payload}_1` })
        .textButton({ label: "Вывести", payload: { action: "withdraw" }, color: "secondary" }).row()

    ,

    orel_and_reshka: Keyboard.builder()
        .textButton({ label: "Банк", payload: { action: "bank" }, color: "positive" })
        .textButton({ label: "Баланс", payload: { action: "balance" }, color: "positive" }).row()

        .textButton({ label: "Орёл", payload: { action: "orel|reshka@orel" }, color: "primary" })
        .textButton({ label: "Решка", payload: { action: "orel|reshka@reshka" }, color: "primary" }).row()

        .urlButton({ label: "Пополнить", payload: { action: "replenish" }, url: `https://vk.com/coin#x${vkcoin.vkcoin_private_user_id}_1000_${vkcoin.vkcoin_transer_payload}_1` })
        .textButton({ label: "Вывести", payload: { action: "withdraw" }, color: "secondary" }).row()

    ,


    double_keyboard: Keyboard.builder()
        .textButton({ label: "Банк", payload: { action: "bank" }, color: "positive" })
        .textButton({ label: "Баланс", payload: { action: "balance" }, color: "positive" }).row()

        .textButton({ label: "X2", payload: { action: "double@x2" }, color: "primary" })
        .textButton({ label: "X3", payload: { action: "double@x3" }, color: "primary" }).row()

        .textButton({ label: "X5", payload: { action: "double@x5" }, color: "primary" })
        .textButton({ label: "X10", payload: { action: "double@x10" }, color: "primary" }).row()

        .urlButton({ label: "Пополнить", payload: { action: "replenish" }, url: `https://vk.com/coin#x${vkcoin.vkcoin_private_user_id}_1000_${vkcoin.vkcoin_transer_payload}_1` })
        .textButton({ label: "Вывести", payload: { action: "withdraw" }, color: "secondary" }).row()

    ,



    down_7_up_keyboard: Keyboard.builder()
        .textButton({ label: "Банк", payload: { action: "bank" }, color: "positive" })
        .textButton({ label: "Баланс", payload: { action: "balance" }, color: "positive" }).row()

        .textButton({ label: "> 7 (х2)", payload: { action: "down7up@more" }, color: "secondary" })
        .textButton({ label: "= 7 (х5.5)", payload: { action: "down7up@seven" }, color: "primary" })
        .textButton({ label: "< 7 (х2)", payload: { action: "down7up@less" }, color: "secondary" }).row()

        .urlButton({ label: "Пополнить", payload: { action: "replenish" }, url: `https://vk.com/coin#x${vkcoin.vkcoin_private_user_id}_1000_${vkcoin.vkcoin_transer_payload}_1` })
        .textButton({ label: "Вывести", payload: { action: "withdraw" }, color: "secondary" }).row()
};