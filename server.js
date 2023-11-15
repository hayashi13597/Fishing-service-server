import express from "express";
import cors from "cors";
require("dotenv").config();
import compression from "compression";
import initRoute from "./src/routes";
//config redis file
import RedisServer from "./src/redis/redis.config";
import "./src/redis/subscribe.redis";
import CloudinaryServices from "./src/services/Cloudinary.services";
import multer from "multer";
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
// upload file
//********************************************* */

// SET STORAGE
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
// upload ảnh

export const UploadStore = multer({ storage: storage });

app.post("/user/upload", UploadStore.single("file"), async (req, res) => {
  try {
    if (req.file) {
      const { path } = req.file;
      if (path) {
        const result = await CloudinaryServices.uploadImage(path);
        await CloudinaryServices.DeleteFileInServer(path);

        res
          .status(200)
          .json({ image: result, message: "Tải ảnh thành công", status: 200 });
        return;
      }
      throw new Error("Ảnh không đạt yêu cầu");
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Upload thất bại", status: 404 });
  }
});
app.post("/deleteimage", async function (req, res) {
  const { path } = req.body;
  try {
    if (!path) throw new Error("No path provided");
    await CloudinaryServices.deleteFileImage(path);

    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(404).json({ message: "Xóa không thành công" });
  }
});

app.get("/", async (req, res) => {
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
    // res
    //   .status(200)
    //   .json({ status: true, message: numberRequest, timeExpire: ss });
    res.send("Deloy success!");
  } catch (error) {
    res.status(503).json({
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
