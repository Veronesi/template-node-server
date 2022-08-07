import { NextFunction, Request, Response } from 'express';
import { UniqueConstraintError } from 'sequelize';
import Account from '../../../services/Account.services';
import { encryptPassword } from '../../../services/crypto.services';
import registerMiddleware from '../../../middlewares/register.middlewares';
import { createToken } from '../../../services/jwt.services';
import { AccountLog } from '../../../services/logger.services';

async function postRegister(req: Request, res: Response, next: NextFunction) {
  const { password, username, email } = req.body;

  try {
    const { hash, salt } = await encryptPassword(password.toString());

    await Account.create({ username, email, hash, salt, role: '', emailGoogle: '' });

    const token = createToken(username);

    if (!token) {
      res.status(500).json({
        message: 'authentication creation error',
        error: true,
      });
      return;
    }
    res.set('token', token);
    res.locals.body.message = 'register success';
    next();
  } catch (error: any) {
    if (error instanceof UniqueConstraintError) {
      res.status(401).json({
        error: true,
        message: error.message,
      });
      return;
    }
    AccountLog.warn(error.message);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
}

export default function module(req: Request, res: Response, next: NextFunction) {
  registerMiddleware(req, res, () => postRegister(req, res, next));
}
