/* eslint-disable no-async-promise-executor */
const { VK } = require('vk-io');
const { QuestionManager } = require('vk-io-question');
const { project } = require('../configs/config.js');

const questionManager = new QuestionManager();

const vk = {
    group: new VK({
        token: project.project_bot_token,
        pollingGroupId: project.project_bot_id
    })
};

vk.group.updates.use(questionManager.middleware);

vk.group.updates.start()
    .then(() => console.log(`MurkaGames started!`))
    .catch((err) => console.log(err));

module.exports = vk;