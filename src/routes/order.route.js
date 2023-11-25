import express from "express";
import OrderController from "../controllers/Order.controller";
import middlewares from "../middlewares";

const OrderRouter = express.Router();
//order

OrderRouter.get(
  "/detail",
  middlewares.handleTryCate(OrderController.GetListOrderClient)
)
  .get("/", middlewares.handleTryCate(OrderController.GetAllOrderAdmin))
  .post("/", middlewares.handleTryCate(OrderController.GetOrderDetail))
  .post("/search", middlewares.handleTryCate(OrderController.Search))
  .patch("/", middlewares.handleTryCate(OrderController.Edit))
  .post("/create", middlewares.handleTryCate(OrderController.CreateOrder))
  .delete("/:id", middlewares.handleTryCate(OrderController.DeleteOrder))
  .delete(
    "/detail/:id",
    middlewares.handleTryCate(OrderController.DeleteOrderDetails)
  );

export default OrderRouter;
