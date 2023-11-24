import express from "express";

import MiddleWare from "../middlewares";
import ContactController from "../controllers/Contact.controller";

const ContactRouter = express.Router();
// contact
ContactRouter.get("/", MiddleWare.handleTryCate(ContactController.GetAll))
  .post("/", MiddleWare.handleTryCate(ContactController.Create))
  .post("/contact", MiddleWare.handleTryCate(ContactController.SendContact))
  .delete("/:id", MiddleWare.handleTryCate(ContactController.Delete));

export default ContactRouter;
