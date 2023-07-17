import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../core/trafic.core';

export default async function tipoCuenta(req: Request, res: Response) {
  try {
    sendSuccess(res, {});
  } catch (error: any) {
    sendError(res, error.message);
  }
}
