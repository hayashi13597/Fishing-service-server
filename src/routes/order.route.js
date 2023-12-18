import express from "express";
import OrderController from "../controllers/Order.controller";
import MiddleWare from "../middlewares";
import AccuracyPerson from "../middlewares/auth/Authen";
const OrderRouter = express.Router();
//order

OrderRouter.get(
  "/detail",
  MiddleWare.handleTryCate(AccuracyPerson.Authentication),
  MiddleWare.handleTryCate(OrderController.GetListOrderClient)
)
  .get("/", MiddleWare.handleTryCate(OrderController.GetAllOrderAdmin))
  .post("/", MiddleWare.handleTryCate(OrderController.GetOrderDetail))
  .post("/search", MiddleWare.handleTryCate(OrderController.Search))
  .patch("/", MiddleWare.handleTryCate(OrderController.Edit))
  .post("/create", MiddleWare.handleTryCate(OrderController.CreateOrder))
  .delete(
    "/:id",
    MiddleWare.handleTryCate(AccuracyPerson.Authentication),
    MiddleWare.handleTryCate(OrderController.DeleteOrder)
  )
  .delete(
    "/detail/:id",
    MiddleWare.handleTryCate(AccuracyPerson.Authentication),
    MiddleWare.handleTryCate(OrderController.DeleteOrderDetails)
  );

export default OrderRouter;
