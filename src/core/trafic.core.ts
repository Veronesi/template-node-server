import { Response } from 'express';

export function sendError(res: Response, message: string = 'Something went wrong', code: number = 500) {
  const body = { error: true, code, message };
  res.status(code).send(body);
}
export function sendSuccess(res: Response, payload: any) {
  const body = { error: false, code: 200, message: '', ...payload };
  res.status(body.code).send(body);
}
