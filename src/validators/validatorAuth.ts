import { body } from 'express-validator';

const email = body('email')
  .trim()
  .normalizeEmail()
  .isEmail()
  .withMessage('Invalid email');

const password = body('password')
  .trim()
  .notEmpty()
  .withMessage('password is required')
  .isLength({ min: 6 })
  .withMessage('password must be at least 6 characters long');

const otp= body('otp')
  .trim()
  .notEmpty()
  .withMessage('OTP is required')
  .isLength({ min: 6, max: 6 })
  .withMessage('OTP must be exactly 6 digits')
  .isNumeric()
  .withMessage('OTP must contain only numbers');


export const validateRegister = [
  email,
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  password,
];

export const validateLogin = [
  email,
  
];

export const validateOtp = [
  email,
  otp,
];
