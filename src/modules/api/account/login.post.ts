import { NextFunction, Request, Response } from 'express';
import { createToken } from '../../../services/jwt.services';
import { verifyPassword } from '../../../services/crypto.services';
import Account from '../../../services/Account.services';
import { ResourceNotFoundError } from '../../../core/repository.core';
import { AccountLog } from '../../../services/logger.services';
import loginMiddleware from '../../../middlewares/login.middlewares';

async function postLogin(req: Request, res: Response, next: NextFunction) {
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
      return res.status(400).json({
        message: 'password is wrong',
        newHash,
        hash,
        error: true,
      });
    }

    const token = createToken(username);

    if (!token) {
      return res.status(400).json({
        message: 'authentication creation error',
        error: true,
      });
    }

    // res.set({ authentication: token });
    AccountLog.info(`${username} logged`);
    res.locals.body.authentication = token;
    return next();
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(200).json({
        message: 'user not exist',
        error: true,
      });
    }

    AccountLog.warning(error.message);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
}

export default function route(req: Request, res: Response, next: NextFunction) {
  loginMiddleware(req, res, () => postLogin(req, res, next));
}
