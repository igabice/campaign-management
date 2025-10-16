import { PrismaClient } from "@prisma/client";
import { ContactInput } from "../validations/contact.validation";
import { mailService } from "./mail.service";

const prisma = new PrismaClient();

export class ContactService {
  static async createContact(data: ContactInput) {
    const contact = await prisma.contact.create({
      data,
    });

    // Send email to support
    await this.sendContactEmail(data);

    return contact;
  }

  private static async sendContactEmail(data: ContactInput) {
    const supportEmail = process.env.SUPPORT_EMAIL;
    if (!supportEmail) {
      console.error("SUPPORT_EMAIL not set");
      return;
    }

    const subject = `New Contact Message from ${data.name}`;
    const html = `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
    `;

    await mailService.sendMail({
      to: supportEmail,
      subject,
      html,
    });
  }
}