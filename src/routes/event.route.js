import express from "express";

import MiddleWare from "../middlewares";
import EventController from "../controllers/EventController";

const EventRouter = express.Router();
// cate
EventRouter.get("/", MiddleWare.handleTryCate(EventController.GetAll))
  .get("/:slug", MiddleWare.handleTryCate(EventController.GetOne))
  .post("/", MiddleWare.handleTryCate(EventController.Create))
  .put("/", MiddleWare.handleTryCate(EventController.Edit))
  .delete("/:id", MiddleWare.handleTryCate(EventController.Delete));

export default EventRouter;
