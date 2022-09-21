import { Request, Response } from 'express';
import Account from '../../../services/Account.services';
import Client from '../../../database/redis/Client';
import { sendSuccess } from '../../../core/trafic.core';

export default async function postLogin(req: Request, res: Response) {
  const { id } = req.body;
  const clientCache = await Client.get(`user/${4}`);
  if (clientCache) {
    const user = {
      name: clientCache,
      id,
    };
    sendSuccess(res, { user });
    return;
  }
  const account = await Account.findOne({ id });
  Client.set(`user/${id}`, 'test1');
  sendSuccess(res, { user: account });
}
