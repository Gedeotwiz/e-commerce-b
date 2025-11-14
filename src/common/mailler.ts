import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { verifyEmailTemplate } from 'src/__share__/templetes/verfy-user-templete';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILLER_EMAIL,
      pass: process.env.NODEMAILLER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  async sendOtpEmail(email: string, otp: string) {
    await this.transporter.sendMail({
      from: process.env.NODEMAILLER_EMAIL,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
    });
  }

  async sendVerificationEmail(
    email: string,
    names: string,
    verificationLink: string,
  ) {
    const templete = verifyEmailTemplate(names, verificationLink);
    await this.transporter.sendMail({
      from: `"E-Commerce App" <${process.env.NODEMAILLER_EMAIL}>`,
      to: email,
      subject: 'Verify Your Email',
      html: templete,
    });
  }
}
