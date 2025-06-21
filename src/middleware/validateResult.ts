import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';

export const validateResult = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({  success: false,errors: errors.array() });
    return;
  }
  next();
};
