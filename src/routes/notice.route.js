import express from "express";

import MiddleWare from "../middlewares";
import NoticeController from "../controllers/Notice.controller";
import AccuracyPerson from "../middlewares/auth/Authen";
const NoticeRouter = express.Router();
// notice
NoticeRouter.put("/", MiddleWare.handleTryCate(NoticeController.UpdateNotice))
  .post("/", MiddleWare.handleTryCate(NoticeController.GetAllNotice))
  .get("/", MiddleWare.handleTryCate(NoticeController.GetNoticeAccount))
  .delete(
    "",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(NoticeController.CleanAll)
  )
  .delete(
    "/:id",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(NoticeController.CleanOne)
  );

export default NoticeRouter;
