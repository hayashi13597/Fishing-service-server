import express from "express";
import UserController from "../controllers/User.controller";
import MiddleWare from "../middlewares";
import multer from "multer";
import path from "path";
const UserRouter = express.Router();

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
//user
UserRouter.post("/register", MiddleWare.handleTryCate(UserController.register))
  .put("", MiddleWare.handleTryCate(UserController.UpdateProfile)) //  cập nhập profile
  .post("/login", MiddleWare.handleTryCate(UserController.login)) // đăng nhập
  .post("/firebase", MiddleWare.handleTryCate(UserController.LoginWithFirebase)) // đăng ký đang nhâp firebase
  .post("/firstlogin", MiddleWare.handleTryCate(UserController.FirstLogin)) // login with token
  .post(
    "/changepassword",
    MiddleWare.handleTryCate(UserController.ChangePassword)
  ) // thay đổi mật mật khảu
  .post(
    "/changeavatar",
    UploadStore.single("file"),
    MiddleWare.handleTryCate(UserController.ChangeAvatar)
  )
  .post(
    "/resetavatar",

    MiddleWare.handleTryCate(UserController.ResetAvatar)
  )
  .delete("/:userid", MiddleWare.handleTryCate(UserController.DeleteUser));

export default UserRouter;
