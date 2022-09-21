import { NextFunction, Response, Request } from 'express';
import { sendError } from '../core/trafic.core';

export default function loginMiddleware(req: Request, res: Response, next: NextFunction) {
  const { password, username } = req.body;

  // check if send password and username
  if (!username) {
    sendError(res, 'username is undefined');
    return;
  }

  // login...
  if (!password) {
    sendError(res, 'password is undefined');
    return;
  }
  next();
}
