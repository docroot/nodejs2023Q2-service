import { Injectable, Logger, LoggerService } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { RotatingLogfile } from './rotating-logfile';


@Injectable()
export class LogService  implements LoggerService {
  private readonly level: string;
  private readonly dir: string;
  private readonly maxSize: number;
  private msgLog: RotatingLogfile;

  constructor() {
    this.level = process.env['LOG_LEVEL'] ?? 'error';
    this.dir = process.env['LOG_DIR'] ?? '/var/log/rsschool';
    this.maxSize = process.env['LOG_MAX_SIZE'] ? parseInt(process.env['LOG_MAX_SIZE']) : 512;
    console.log(`CWD: ${process.cwd()}`);
    console.log(`process.env.LOG_LEVEL: ${this.level}`);
    console.log(`process.env.LOG_DIR: ${this.dir}`);
    console.log(`process.env.LOG_MAX_SIZE: ${this.maxSize}`);
    this.msgLog = new RotatingLogfile(this.dir, 'messages.log', this.maxSize);
  }

  log(message: string) {
    this.msgLog.putMessage(message);
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
