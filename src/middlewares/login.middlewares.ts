import { NextFunction, Response, Request } from 'express';

export default function loginMiddleware(req: Request, res: Response, next: NextFunction) {
  const { password, username } = req.body;

  // check if send password and username
  if (!username) {
    res.status(400).json({
      message: 'username is undefined',
      error: true,
    });
    return;
  }

  // login...
  if (!password) {
    res.status(400).json({
      message: 'password is undefined',
      error: true,
    });
    return;
  }
  next();
}
