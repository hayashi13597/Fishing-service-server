import express from "express";

import MiddleWare from "../middlewares";
import ProductController from "../controllers/Product.controller";

const ProductRouter = express.Router();
// product
ProductRouter.get(
  "/home",
  MiddleWare.handleTryCate(ProductController.GetViewHomeClient)
)
  .get("/allslug", MiddleWare.handleTryCate(ProductController.GetAllSlug))
  .post("/search", MiddleWare.handleTryCate(ProductController.Search))
  .get("/admin", MiddleWare.handleTryCate(ProductController.GetAllAdmin))
  .get("/:slug", MiddleWare.handleTryCate(ProductController.GetOne))
  .get("/seo/:slug", MiddleWare.handleTryCate(ProductController.GetOneToSeo))
  .post("/", MiddleWare.handleTryCate(ProductController.Create))
  .post(
    "/updatesubimage",
    MiddleWare.handleTryCate(ProductController.UpdateSubImage)
  )
  .put("/", MiddleWare.handleTryCate(ProductController.Update))
  .delete("/:id", MiddleWare.handleTryCate(ProductController.Delete));

export default ProductRouter;
