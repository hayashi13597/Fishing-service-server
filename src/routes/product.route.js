import express from "express";

import MiddleWare from "../middlewares";
import ProductController from "../controllers/Product.controller";
import AccuracyPerson from "../middlewares/auth/Authen";
const ProductRouter = express.Router();
// product
ProductRouter.get(
  "/home",
  MiddleWare.handleTryCate(ProductController.GetViewHomeClient)
)
  .get("/allslug", MiddleWare.handleTryCate(ProductController.GetAllSlug))
  .get("/chart", MiddleWare.handleTryCate(ProductController.GetChartAdmin))
  .post("/search", MiddleWare.handleTryCate(ProductController.Search))
  .get("/filter", MiddleWare.handleTryCate(ProductController.GetFilterProduct))
  .get("/admin", MiddleWare.handleTryCate(ProductController.GetAllAdmin))
  .get("/:slug", MiddleWare.handleTryCate(ProductController.GetOne))
  .get("/seo/:slug", MiddleWare.handleTryCate(ProductController.GetOneToSeo))
  .post(
    "/",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(ProductController.Create)
  )
  .post(
    "/updatesubimage",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(ProductController.UpdateSubImage)
  )
  .put(
    "/",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(ProductController.Update)
  )
  .delete(
    "/:id",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(ProductController.Delete)
  );

export default ProductRouter;
