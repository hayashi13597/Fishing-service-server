import express from "express";

import MiddleWare from "../middlewares";
import ContactController from "../controllers/Contact.controller";

const ContactRouter = express.Router();
// cate
ContactRouter.get("/", MiddleWare.handleTryCate(ContactController.GetAll))
  .post("/", MiddleWare.handleTryCate(ContactController.Create))
  .delete("/:id", MiddleWare.handleTryCate(ContactController.Delete));

export default ContactRouter;
