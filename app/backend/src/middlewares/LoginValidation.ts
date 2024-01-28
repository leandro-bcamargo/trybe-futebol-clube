import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export default class LoginValidation {
  static validate(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;
    const validateLoginSchema = Joi.object({
      email: Joi.string().email().empty('').required(),
      password: Joi.string().min(6).empty('').required(),
    }).messages({
      'any.required': 'All fields must be filled',
      'string.email': 'Invalid email or password',
      'string.min': 'Invalid email or password',
    });
    const { error } = validateLoginSchema.validate({ email, password });
    if (error) {
      const { type } = error.details[0];
      const { message } = error.details[0];
      if (type === 'any.required') return res.status(400).json({ message });
      return res.status(401).json({ message });
    }

    next();
  }
}
