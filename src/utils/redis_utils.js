import redis from 'redis';
import logger from './logger_utils.js';


const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

client.on('connect', () => {
    logger.info('Redis connected successfully');
});

client.on('error', (err) => {
    logger.error('Redis connection failed:', err);
});


export default client;

