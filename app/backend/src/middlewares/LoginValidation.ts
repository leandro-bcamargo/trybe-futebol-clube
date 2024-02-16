import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import CustomError from '../utils/CustomError';

export default class LoginValidation {
  static getLoginSchema() {
    return Joi.object({
      email: Joi.string().email().empty('').required(),
      password: Joi.string().min(6).empty('').required(),
    }).messages({
      'any.required': 'All fields must be filled',
      'string.email': 'Invalid email or password',
      'string.min': 'Invalid email or password',
    });
  }

  static validateInput(email: string, password: string) {
    const { error } = this.getLoginSchema().validate({ email, password });
    return error;
  }

  static handleError(error: Joi.ValidationError) {
    const { type } = error.details[0];
    const { message } = error.details[0];
    if (type === 'any.required') throw new CustomError('INVALID_DATA', message);
    throw new CustomError('UNAUTHORIZED', message);
  }

  static validate(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;
    const error = this.validateInput(email, password);
    if (error) {
      this.handleError(error);
    }
    next();
  }
}
