import express from "express";
import UserController from "../controllers/User.controller";
import MiddleWare from "../middlewares";
const UserRouter = express.Router();
//user
UserRouter.get("/getUser", MiddleWare.handleTryCate(UserController.getUsers))
  .post("", MiddleWare.handleTryCate(UserController.register))
  .post(
    "/firebase",
    MiddleWare.handleTryCate(UserController.LoginWithFirebase)
  );

export default UserRouter;
