const Bull = require('bull');
const fileQueue = new Bull('fileQueue', {
  redis: {
    host: 'localhost',
    port: 6379, // Redis server configuration
  },
});

module.exports = fileQueue;
