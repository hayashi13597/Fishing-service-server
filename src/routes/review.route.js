import express from "express";

import MiddleWare from "../middlewares";
import ReviewController from "../controllers/Review.controller";
import AccuracyPerson from "../middlewares/auth/Authen";
const ReviewRouter = express.Router();
// review
ReviewRouter.get("/", MiddleWare.handleTryCate(ReviewController.GetAll))
  .post(
    "/",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(ReviewController.Create)
  )
  .get("/:productId", MiddleWare.handleTryCate(ReviewController.GetOne))
  .post("/order", MiddleWare.handleTryCate(ReviewController.GetOrderReviews))
  .post("/evaluate", MiddleWare.handleTryCate(ReviewController.HandleEvaluate))

  .delete(
    "/:id",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(ReviewController.Delete)
  );

export default ReviewRouter;
