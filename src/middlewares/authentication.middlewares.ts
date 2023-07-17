import { Request, Response, NextFunction } from 'express';
import { createToken, verifyToken } from '../services/jwt.service';
import ROUTES from '../configs/routes';
import { sendError } from '../core/trafic.core';

export default function authentication(req: Request, res: Response, next: NextFunction) {
  const token = req.get('Authorization');
  const control = verifyToken(token);

  res.locals.body = {};

  if (control.error) {
    if (ROUTES.PUBLIC_ROUTES.has(req.params.pathname)) {
      next();
      return;
    }
    sendError(res, control.message, 401);
    return;
  }

  // refresh token
  const newToken = createToken(control.decoded.account, control.decoded.userType);
  if (newToken) {
    res.set({ Authorization: newToken });
  }

  res.set({ account: control.decoded.account, userType: control.decoded.userType });
  res.locals.account = control.decoded.account;
  res.locals.userType = control.decoded.userType;

  next();
}
