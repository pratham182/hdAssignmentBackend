
import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, otp: string): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    
  } catch (error) {
 
    throw new Error('Failed to send email');
  }
};
