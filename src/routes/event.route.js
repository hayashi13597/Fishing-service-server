import express from "express";

import MiddleWare from "../middlewares";
import EventController from "../controllers/EventController";

const EventRouter = express.Router();
// event
EventRouter.get("/", MiddleWare.handleTryCate(EventController.GetAll))
  .get("/:slug", MiddleWare.handleTryCate(EventController.GetOne))
  .post("/new", MiddleWare.handleTryCate(EventController.GetViewNewScreen))
  .post("/search", MiddleWare.handleTryCate(EventController.Search))
  .post("/slug", MiddleWare.handleTryCate(EventController.GetAllSlug))
  .post("/", MiddleWare.handleTryCate(EventController.Create))
  .put("/", MiddleWare.handleTryCate(EventController.Edit))
  .delete("/:id", MiddleWare.handleTryCate(EventController.Delete));

export default EventRouter;
