import { NextFunction, Request, Response } from 'express';
import { renderLog } from '../../core/logger/winston.core';

// eslint-disable-next-line no-unused-vars
export default async function LoggerGetAll(req: Request, res: Response, _next: NextFunction) {
  try {
    const table = await renderLog.all();
    return res.status(200).send(`
    <html>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
      <body class="container pt-5">
        <h5 class="alert alert-info">logger/all</h5>
        <table class="table table-responsive table-striped bg-light border shadow-sm mt-3">
          <thead class="table-dark">
            <tr>
              <th>Level</th>
              <th>Message</th>
              <th class="text-center" style="min-width: 12em">Timestamp</th>
            </tr>
          </thrad>
          <tbody>
          ${table.reverse().reduce((acc: string, e: any) => acc + `
          <tr class="${e.level == 'error' ? 'table-danger' : ( e.level == 'warn' ? 'table-warning' : '' )}">
            <td><span class="badge ${e.level == 'error' ? 'bg-danger' : ( e.level == 'warn' ? 'bg-warning text-dark' : 'bg-primary' )}">${e.level}</span></td>
            <td>${e.message}</td>
            <td>${e.timestamp}</td>
          </tr>` , '')}
          </tbody>
        </table>
      </body>
    </html>
    `);
  } catch (error) {
    return res.json({ error });
  }
}
