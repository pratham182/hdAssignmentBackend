import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Note } from '../models/Notes';
import { sendEmail } from '../util/sendMail';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({ email, password: hashedPassword, name, otp, otpExpires });
    await user.save();
    
    await sendEmail(email, otp);

    res.status(201).json({ message: 'User registered. OTP sent to email.' });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

