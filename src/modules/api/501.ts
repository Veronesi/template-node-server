import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line no-unused-vars
export default async function routeNotFound(req: Request, res: Response, _next: NextFunction) {
  return res.status(200).json({
    error: true,
    message: 'route not found',
  });
}
