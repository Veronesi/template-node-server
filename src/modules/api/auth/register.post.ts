import { Request, Response } from 'express';
import { UniqueConstraintError } from 'sequelize';
import Account from '../../../services/Account.services';
import { encryptPassword } from '../../../services/crypto.services';
import registerMiddleware from '../../../middlewares/register.middlewares';
import { createToken } from '../../../services/jwt.service';
import { AccountLog } from '../../../services/logger.service';
import { sendError, sendSuccess } from '../../../core/trafic.core';

async function postRegister(req: Request, res: Response) {
  const { password, username, email } = req.body;

  try {
    const { hash, salt } = await encryptPassword(password.toString());

    const account = await Account.create({ username, email, hash, salt, role: '', emailGoogle: '' });

    const token = createToken(username, account.role);

    if (!token) {
      sendError(res, 'authentication creation error');
      return;
    }
    res.set('token', token);
    sendSuccess(res, { message: 'register success' });
    return;
  } catch (error: any) {
    if (error instanceof UniqueConstraintError) {
      sendError(res, error.message);
      return;
    }
    AccountLog.warn(error.message);
    sendError(res, error.message);
  }
}

export default function module(req: Request, res: Response) {
  registerMiddleware(req, res, () => postRegister(req, res));
}
