import { Router } from "express";
import { ContactController } from "../controllers/contact.controller";
import { contactSchema } from "../validations/contact.validation";
import validate from "../middlewares/validate";

const router = Router();

router.post("/", validate(contactSchema), ContactController.createContact);

export default router;
