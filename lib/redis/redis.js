const { createClient } = require('redis');

const redis = createClient({
    url: "redis://localhost:6379"
});

redis.connect().then(() => console.log(`Redis подключен`));

module.exports = redis;