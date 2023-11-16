import express from "express";

import MiddleWare from "../middlewares";
import ProductController from "../controllers/Product.controller";

const ProductRouter = express.Router();
// product
ProductRouter.get(
  "/home",
  MiddleWare.handleTryCate(ProductController.GetViewHomeClient)
)
  .get("/admin", MiddleWare.handleTryCate(ProductController.GetAllAdmin))
  .get("/:slug", MiddleWare.handleTryCate(ProductController.GetOne))
  .post("/", MiddleWare.handleTryCate(ProductController.Create))
  .put("/", MiddleWare.handleTryCate(ProductController.Update))
  .delete("/:id", MiddleWare.handleTryCate(ProductController.Delete));

export default ProductRouter;
