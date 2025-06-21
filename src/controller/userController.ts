import { Request, Response } from 'express';
import { IUser, User } from '../models/User';
import { sendEmail } from '../util/sendMail';
import { generateOtp } from '../util/generateOtp';
import { comparePassword, hashPassword } from '../util/hashPassword';
import { generateToken } from '../util/jwt';
import { OAuth2Client } from 'google-auth-library';

import dotenv from 'dotenv';

dotenv.config();


interface GooglePayload {
  email: string;
  name: string;
  email_verified: boolean;
}


export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.verified) {
      return res.status(400).json({success:false, message: 'User already exists' });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const hashedPassword = await hashPassword(password);

    const user = await User.findOneAndUpdate(
      { email },
      { name, password: hashedPassword, otp, otpExpires, verified: false },
      { upsert: true, new: true }
    );

    await sendEmail(email, otp);

    res.status(201).json({ success:true, message: 'otp send to mail' });
  } catch (error) {
    res.status(500).json({ success:false,message: 'Internal server error' });
  }
};



export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email }) as IUser;
  if (!user) return res.status(404).json({success:false, message: 'User not found' });

  if (!user.otp || user.otp !== otp || new Date() > user.otpExpires!) {
    return res.status(400).json({ success:false,message: 'Invalid or expired OTP' });
  }

  user.verified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  

  const token = generateToken({ userId: user._id.toString()});

  res.json({ success:true,message: 'OTP verified', token, user: { name: user.name, email: user.email } });
};



export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
 

  if(!user){
    return res.status(404).json({success:false, message: 'No User Found' });
  }

  if(!user.verified){
    return res.status(401).json({ success:false ,message: 'User not verfied yet' });

  }
  if (!user.password) {
    return res.status(401).json({ success:false,message: 'invalid credentials' });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken({ userId: user._id });

  res.json({ success:true,token, user: { name: user.name, email: user.email } });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const googleLoginOrSignup = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'No ID token provided' });
    }
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload() as GooglePayload;

    if (!payload?.email_verified) {
      return res.status(400).json({ success:false,message: 'Email not verified by Google' });
    }

    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        verified: true,
        googleAuth: true,
      });
      await user.save();
    }

    const token = generateToken({ userId: user._id.toString() });

    res.json({
      success: true,
      message: 'Google sign-in successful',
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({success:false, message: 'google auth failed' });
  }
};
