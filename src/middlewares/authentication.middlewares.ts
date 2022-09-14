import { Request, Response, NextFunction } from 'express';
import { createToken, verifyToken } from '../services/jwt.services';
import ROUTES from '../configs/routes';

function sendErrror(res: Response, message: string) {
  res.status(401).json({
    error: true,
    message,
  });
}

export default function authentication(req: Request, res: Response, next: NextFunction) {
  const token = req.get('authentication');
  const control = verifyToken(token);

  res.locals.body = {};

  if (control.error) {
    if (ROUTES.PUBLIC_ROUTES.has(req.params.pathname)) {
      return next();
    }
    return sendErrror(res, control.message);
  }

  // refresh token
  const newToken = createToken(control.decoded.account);
  if (newToken) {
    res.set({ token: newToken });
  }

  res.set({ account: control.decoded.account });
  res.locals.account = control.decoded.account;
  return next();
}
