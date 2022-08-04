import { NextFunction, Request, Response } from 'express';

export default async function postLogin(req: Request, res: Response, next: NextFunction) {
  return res.status(200).json({
    error: true,
  });
}