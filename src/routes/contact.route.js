import express from "express";

import MiddleWare from "../middlewares";
import ContactController from "../controllers/Contact.controller";
import AccuracyPerson from "../middlewares/auth/Authen";
const ContactRouter = express.Router();
// contact
ContactRouter.get("/", MiddleWare.handleTryCate(ContactController.GetAll))
  .post(
    "/",

    MiddleWare.handleTryCate(ContactController.Create)
  )
  .post(
    "/contact",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(ContactController.SendContact)
  )
  .delete(
    "/:id",
    MiddleWare.handleTryCate(AccuracyPerson.Authorization),
    MiddleWare.handleTryCate(ContactController.Delete)
  );

export default ContactRouter;
