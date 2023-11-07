import express from "express";
import UserController from "../controllers/User.controller";
import MiddleWare from "../middlewares";
const UserRouter = express.Router();
//user
UserRouter.get("/getUser", MiddleWare.handleTryCate(UserController.getUsers))
  .post("", MiddleWare.handleTryCate(UserController.register)) // đăng ký
  .post("/login", MiddleWare.handleTryCate(UserController.login)) // đăng nhập
  .post("/firebase", MiddleWare.handleTryCate(UserController.LoginWithFirebase)) // đăng ký đang nhâp firebase
  .post("/firstlogin", MiddleWare.handleTryCate(UserController.FirstLogin)); // login with token

export default UserRouter;
