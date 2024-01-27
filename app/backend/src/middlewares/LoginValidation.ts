import { NextFunction, Request, Response } from 'express';

export default class LoginValidation {
  static validate(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;
    console.log('email, password', email, password);
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    next();
  }
}
