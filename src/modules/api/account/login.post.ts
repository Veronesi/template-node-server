import { Request, Response } from 'express';
import { createToken } from '../../../services/jwt.services';
import { verifyPassword } from '../../../services/crypto.services';
import Account from '../../../services/Account.services';
import { ResourceNotFoundError } from '../../../core/repository.core';
import { AccountLog } from '../../../services/logger.services';
import loginMiddleware from '../../../middlewares/login.middlewares';
import { sendSuccess, sendError } from '../../../core/trafic.core';

async function postLogin(req: Request, res: Response) {
  const { password, username } = req.body;

  // check credentials
  try {
    const account = await Account.findOne({ username }, ['hash', 'salt']);
    if (!account) {
      throw new ResourceNotFoundError();
    }

    const { hash, salt } = account;

    const newHash = await verifyPassword(password.toString(), salt);
    if (newHash !== hash) {
      sendError(res, 'password is wrong');
      return;
    }

    const token = createToken(username);

    if (!token) {
      sendError(res, 'authentication creation error');
      return;
    }

    AccountLog.info(`${username} logged`);
    sendSuccess(res, { authentication: token });
    return;
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      sendError(res, 'user not exist');
      return;
    }

    AccountLog.warning(error.message);
    sendError(res, error.message);
  }
}

export default function route(req: Request, res: Response) {
  loginMiddleware(req, res, () => postLogin(req, res));
}
