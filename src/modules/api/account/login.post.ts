import { Request, Response } from 'express';
import { verifyToken, createToken } from '../../../services/jwt.services';
import { verifyPassword } from '../../../services/crypto.services';
import Account from '../../../services/Account.services';
import { ResourceNotFoundError } from '../../../core/repository.core';

export default async function postLogin(req: Request, res: Response) {
  const { password, username } = req.body;

  // check if user is already logead
  const getToken = req.get('token');
  const control = verifyToken(getToken);
  if (!control.error) {
    return res.status(500).json({
      message: 'you are login',
      error: true,
    });
  }

  // login...
  if (!password) {
    return res.status(505).json({
      message: 'password is undefined',
      error: true,
    });
  }

  if (!username) {
    return res.status(505).json({
      message: 'username is undefined',
      error: true,
    });
  }

  // user is loged
  const token = createToken(username);

  if (!token) {
    return res.status(505).json({
      message: 'authentication creation error',
      error: true,
    });
  }

  // check password
  try {
    const account = await Account.findOne({ username }, ['hash', 'salt']);
    if (!account) {
      throw new ResourceNotFoundError();
    }

    const { hash, salt } = account;

    const newHash = await verifyPassword(password.toString(), salt);
    if (newHash !== hash) {
      return res.status(505).json({
        message: 'password is wrong',
        newHash,
        hash,
        error: true,
      });
    }

    res.set({ authentication: token });
    return res.status(200).json({
      authentication: token,
      error: false,
    });
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(200).json({
        authentication: '',
        error: true,
      });
    }
    return res.status(501).json({
      error: true,
      message: error.message,
    });
  }
}
