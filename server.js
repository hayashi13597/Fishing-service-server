import express from "express";
import cors from "cors";
require("dotenv").config();

import initRoute from "./src/routes";
import compression from "compression";
//config redis file
import RedisServer from "./src/redis/redis.config";
import "./src/redis/subscribe.redis";
import multer from "multer";
import CloudinaryServices from "./src/services/cloudinary.services";
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

const UploadStore = multer({ storage: storage });
app.post("/upload", UploadStore.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (file) {
      const { path } = req.file;
      if (path) {
        const result = await CloudinaryServices.uploadImage(path);
        await CloudinaryServices.DeleteFileInServer(path);
        const data = {
          imageUrl: result.url,
          idPath: result.path,
        };
        res.status(200).json(data);
        return;
      }
      throw new Error("Ảnh không đạt yêu cầu");
    }
  } catch (error) {
    res.status(404).json({ message: "Tải ảnh thất bại" });
  }
});
app.delete("/upload/:idPath", async function (req, res) {
  try {
    const idPath = req.params.idPath;
    if (idPath) {
      await CloudinaryServices.deleteFileImage(idPath);
    }
    res.status(200).json("Xóa thành công");
  } catch (err) {
    res.status(404).json("Xóa thất bại");
  }
});
app.get("/", async (req, res) => {
  res.send("hello");
});

initRoute(app);

app.get("/", (req, res) => {
  res.send("BACK END OKE");
});
app.listen(PORT, "0.0.0.0", () => {
  console.log("start sever PORT: ", PORT);
});
