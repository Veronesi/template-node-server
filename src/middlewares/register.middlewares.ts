import { NextFunction, Response, Request } from 'express';
import Account from '../services/Account.services';
import { sendError } from '../core/trafic.core';

export default async function registerMiddleware(req: Request, res: Response, next: NextFunction) {
  const { password, username, email } = req.body;

  // check if send username
  if (!username) {
    sendError(res, 'username is undefined');
    return;
  }

  // check if send password
  if (!password) {
    sendError(res, 'password is undefined');
    return;
  }

  // check if send email
  if (!email) {
    sendError(res, 'email is undefined');
    return;
  }

  // check if username already exist
  const account = await Account.findOne({ username });
  if (account) {
    sendError(res, 'username already exist');
    return;
  }

  next();
}
