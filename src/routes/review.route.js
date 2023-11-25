import express from "express";

import MiddleWare from "../middlewares";
import ReviewController from "../controllers/Review.controller";

const ReviewRouter = express.Router();
// review
ReviewRouter.get("/", MiddleWare.handleTryCate(ReviewController.GetAll))

  .post("/", MiddleWare.handleTryCate(ReviewController.Create))
  .get("/:productId", MiddleWare.handleTryCate(ReviewController.GetOne))
  .delete("/:id", MiddleWare.handleTryCate(ReviewController.Delete));

export default ReviewRouter;
