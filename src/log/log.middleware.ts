// logging.middleware.ts
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogService } from './log.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(@Inject(LogService) private readonly logger: LogService){};

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, params, body } = req;
    const start = new Date();

    this.logger.log(`[${start.toISOString()}] REQ: ${method}, ${originalUrl}, pararms: ${JSON.stringify(params)}, body: ${JSON.stringify(body)}, from: ${ip}`);

    res.on('finish', () => {
      const { statusCode }= res;
      const end = new Date();
      const responseTime = end.getTime() - start.getTime();

      this.logger.log(`[${end.toISOString()}] RES: ${method}, ${originalUrl}, code: ${statusCode}, time: ${responseTime}ms`);
    });

    next();
  }
}
