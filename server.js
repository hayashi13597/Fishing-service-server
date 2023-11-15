import express from "express";
import cors from "cors";
require("dotenv").config();

import initRoute from "./src/routes";
import compression from "compression";
//config redis file
import RedisServer from "./src/redis/redis.config";
import "./src/redis/subscribe.redis";

const path = require("path");
// end redis file
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  express.urlencoded({
    type: "application/x-www-form-urlencoded",
    extended: true,
    limit: 1024 * 200,
    parameterLimit: 1024 * 200,
  })
);

app.use(express.static(path.join(__dirname, "public")));
//Khai báo sử dụng middleware cookieParse()
// admin

//*end setting path

app.use(
  compression({ level: 6, threshold: 100 * 1000, filter: shouldCompress })
);

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}

app.get("/", async (req, res) => {
  res.send("hello");
});

initRoute(app);

app.get("/", (req, res) => {
  res.send("BACK END OKE");
});
app.listen(PORT, () => {
  console.log("start sever PORT: ", PORT);
});
