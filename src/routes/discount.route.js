import express from "express";
import DiscountController from "../controllers/DiscountController";
import MiddleWare from "../middlewares";
import AccuracyPerson from "../middlewares/auth/Authen";
const DiscountRouter = express.Router();
//discount

DiscountRouter.get(
  "/",
  MiddleWare.handleTryCate(AccuracyPerson.Authorization),
  MiddleWare.handleTryCate(DiscountController.GetAllDiscount)
)
  .post("/search", MiddleWare.handleTryCate(DiscountController.Search))
  .post(
    "/",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(DiscountController.AddDiscount)
  )
  .post("/verify", MiddleWare.handleTryCate(DiscountController.checkoutCode))
  .put(
    "/",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(DiscountController.UpdateDiscount)
  )
  .delete(
    "/:discountId",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(DiscountController.DeleteDiscount)
  );

export default DiscountRouter;
