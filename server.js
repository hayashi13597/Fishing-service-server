import express from "express";
import cors from "cors";
require("dotenv").config();

import initRoute from "./src/routes";
//config redis file
import RedisServer from "./src/redis/redis.config";
import "./src/redis/subscribe.redis";
// end redis file
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/home", async (req, res) => {
  const ip = res.header["x-forwarded-for"] || res.connection.remoteAddress;
  let ss;
  let numberRequest = await RedisServer.incr(ip);
  try {
    if (numberRequest == 1) {
      await RedisServer.expire(ip, 20);
      ss = 20;
    } else {
      ss = await RedisServer.ttl(ip);
    }
    if (ss < 0) {
      await RedisServer.expire(ip, 20);
    }
    if (numberRequest > 20) {
      throw new Error("Sever is busy!");
    }

    console.log({ status: true, message: numberRequest, timeExpire: ss });
    res
      .status(200)
      .json({ status: true, message: numberRequest, timeExpire: ss });
  } catch (error) {
    res
      .status(503)
      .json({
        status: false,
        timeExpire: ss,
        numberRequest,
        message: error.message,
      });
  }
});
initRoute(app);
app.listen(PORT, () => {
  console.log("start sever PORT: ", PORT);
});
