import { createClient } from "redis";

let redisClient = null;

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on("error", (err) => {
    console.log("Redis error:", err);
  });

  await redisClient.connect();
} else {
  console.log("Redis not configured. Running without Redis.");
}

export default redisClient;
