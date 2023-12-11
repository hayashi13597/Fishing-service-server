import express from "express";

import MiddleWare from "../middlewares";
import EventController from "../controllers/EventController";
import AccuracyPerson from "../middlewares/auth/Authen";
const EventRouter = express.Router();
// event
EventRouter.get("/", MiddleWare.handleTryCate(EventController.GetAll))
  .get("/:slug", MiddleWare.handleTryCate(EventController.GetOne))
  .post("/new", MiddleWare.handleTryCate(EventController.GetViewNewScreen))
  .post("/search", MiddleWare.handleTryCate(EventController.Search))
  .post("/slug", MiddleWare.handleTryCate(EventController.GetAllSlug))
  .post(
    "/",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(EventController.Create)
  )
  .put(
    "/",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(EventController.Edit)
  )
  .delete(
    "/:id",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(EventController.Delete)
  );

export default EventRouter;
