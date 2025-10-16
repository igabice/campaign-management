import { Request, Response } from "express";
import { ContactService } from "../services/contact.service";
import { contactSchema } from "../validations/contact.validation";
import ApiError from "../utils/ApiError";

export class ContactController {
  static async createContact(req: Request, res: Response) {
    try {
      const validatedData = contactSchema.parse(req.body);
      const contact = await ContactService.createContact(validatedData);
      res.status(201).json({
        success: true,
        message: "Contact message sent successfully",
        data: contact,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(400, error.message);
      }
      throw new ApiError(500, "Internal server error");
    }
  }
}
