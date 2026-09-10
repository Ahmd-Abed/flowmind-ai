const Redis = require("ioredis");


const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});


redis.on("connect",()=>{
  console.log("Redis connected");
});


redis.on("error",(error)=>{
  console.log(
    "Redis error",
    error
  );
});


module.exports = redis;
