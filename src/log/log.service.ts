import { Injectable, Logger, LoggerService } from '@nestjs/common';

@Injectable()
export class LogService  implements LoggerService {
  private readonly logger = new Logger();

  log(message: string) {
    console.log(message);
    // this.logger.log(message);
  }

  error(message: string, trace: string) {
    console.error(message, trace);
  }

  warn(message: string) {
    console.warn(message);
  }

  debug(message: string) {
    console.debug(message);
  }
}
