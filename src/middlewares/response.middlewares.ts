import { Response, Request } from 'express';

export default function response(req: Request, res: Response) {
  const { body = {} } = res.locals;
  res.status(200).send({
    error: false,
    ...body,
  });
}
