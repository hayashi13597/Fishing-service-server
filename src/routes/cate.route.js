import express from "express";

import MiddleWare from "../middlewares";
import CategoriController from "../controllers/Categori.controller";
import AccuracyPerson from "../middlewares/auth/Authen";
const CateRotuer = express.Router();
// cate
CateRotuer.get("/", MiddleWare.handleTryCate(CategoriController.GetAll))
  .get("/:id", MiddleWare.handleTryCate(CategoriController.GetOne))
  .post("/:slug", MiddleWare.handleTryCate(CategoriController.GetOneSlug))
  .post(
    "/seo/:slug",
    MiddleWare.handleTryCate(CategoriController.GetOneSlugSeo)
  )
  .post(
    "/",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(CategoriController.Create)
  )
  .put(
    "/",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(CategoriController.Update)
  )
  .delete(
    "/:id",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(CategoriController.Delete)
  );

export default CateRotuer;
