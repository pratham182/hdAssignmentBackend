import express from 'express';
import {
  registerUser,
  verifyOtp,
  loginUser,
  googleLoginOrSignup,
} from '../controller/userController';
import { validateRegister, validateLogin, validateOtp } from '../validators/validatorAuth';
import { validateResult } from '../middleware/validateResult';
import { RequestHandler } from 'express';


const router = express.Router();

router.post('/register', validateRegister, validateResult, registerUser as RequestHandler);

router.post('/verify-otp', validateOtp, validateResult, verifyOtp as RequestHandler);

router.post('/login', validateLogin, validateResult, loginUser as RequestHandler);

router.post('/google-auth', googleLoginOrSignup as RequestHandler); 

export default router;
