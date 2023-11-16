import express from "express";

import MiddleWare from "../middlewares";
import NoticeController from "../controllers/Notice.controller";

const NoticeRouter = express.Router();
// notice
NoticeRouter.put(
  "/",
  MiddleWare.handleTryCate(NoticeController.UpdateNotice)
).post("/", MiddleWare.handleTryCate(NoticeController.GetAllNotice));

export default NoticeRouter;
