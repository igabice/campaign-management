import axios from "axios";

class WhatsAppService {
  private apiUrl: string;
  private accessToken: string;

  constructor() {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      throw new Error(
        "WhatsApp configuration missing. Please set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN environment variables."
      );
    }

    this.apiUrl = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
    this.accessToken = accessToken;
  }

  async sendTemplateMessage(to: string, templateName = "hello_world") {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          messaging_product: "whatsapp",
          to: to, // Format: 1234567890 (no + or spaces)
          type: "template",
          template: {
            name: templateName,
            language: {
              code: "en_US",
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("WhatsApp message sent:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error sending WhatsApp message:",
        error instanceof Error ? error.message : error
      );
      throw error;
    }
  }

  async sendTextMessage(to: string, text: string) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "text",
          text: {
            preview_url: false,
            body: text,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("WhatsApp text sent:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error sending WhatsApp text:",
        error instanceof Error ? error.message : error
      );
      throw error;
    }
  }
}

export default new WhatsAppService();
