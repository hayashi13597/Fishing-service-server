import express from "express";
import DiscountController from "../controllers/DiscountController";
import middlewares from "../middlewares";

const DiscountRouter = express.Router();
//discount

DiscountRouter.get(
  "/",
  middlewares.handleTryCate(DiscountController.GetAllDiscount)
)
  .post("/", middlewares.handleTryCate(DiscountController.AddDiscount))
  .post("/verify", middlewares.handleTryCate(DiscountController.checkoutCode))
  .put("/", middlewares.handleTryCate(DiscountController.UpdateDiscount))
  .delete(
    "/:discountId",
    middlewares.handleTryCate(DiscountController.DeleteDiscount)
  );

export default DiscountRouter;
