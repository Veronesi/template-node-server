import { Request, Response } from 'express';

export default async function postLogin(req: Request, res: Response) {
  const { id } = req.body;
  return res.status(200).json({
    user: {
      name: 'test',
      id,
    },
    error: false,
  });
}