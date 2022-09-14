import { NextFunction, Request, Response } from 'express';
import Account from '../../../services/Account.services';
import Client from '../../../database/redis/Client';

export default async function postLogin(req: Request, res: Response, next: NextFunction) {
  const { id } = req.body;
  const clientCache = await Client.get('user/'+4);
  if(clientCache){
    res.locals.body.user = {
      name: clientCache,
      id
    }
    return next();
  }
  const account = await Account.findOne({ id });
  Client.set('user/'+id,'test1');
  res.locals.body.user = account;
  return next();
}