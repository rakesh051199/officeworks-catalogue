import nodemailer from "nodemailer";
import type { EmailProvider, EnquiryEmail } from "../../ports/EmailProvider.js";

export class SmtpEmailProvider implements EmailProvider {
  private readonly transporter: nodemailer.Transporter;

  constructor(host: string, port: number) {
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false
    });
  }

  async send(email: EnquiryEmail): Promise<void> {
    await this.transporter.sendMail({
      to: email.to,
      from: email.from,
      subject: email.subject,
      text: email.text
    });
  }
}
