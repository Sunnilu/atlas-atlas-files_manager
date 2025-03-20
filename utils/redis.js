// utils/redis.js

const redis = require('redis');

class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = redis.createClient();

    // Listen for errors and log them
    this.client.on('error', (err) => {
      console.error(`Redis error: ${err}`);
    });
  }

  // Check if the Redis client is connected
  isAlive() {
    return this.client.connected;
  }

  // Get a value by key from Redis
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  // Set a value in Redis with expiration time (in seconds)
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  // Delete a value by key from Redis
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

// Create an instance of RedisClient and export it
const redisClient = new RedisClient();
module.exports = redisClient;
