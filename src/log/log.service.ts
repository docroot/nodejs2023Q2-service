import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { RotatingLogfile } from './rotating-logfile';

enum LogLevelNum {
  log,
  error,
  warn,
  debug,
  verbose,
}

@Injectable()
export class LogService implements LoggerService {
  private readonly level: string;
  private readonly dir: string;
  private readonly maxSize: number;
  private msgLog: RotatingLogfile;
  private errLog: RotatingLogfile;
  private activeLevels: Map<string, boolean>;

  constructor() {
    this.level = process.env['LOG_LEVEL'] ?? 'error';
    this.dir = process.env['LOG_DIR'] ?? '/var/log/rsschool';
    this.maxSize = process.env['LOG_MAX_SIZE']
      ? parseInt(process.env['LOG_MAX_SIZE'])
      : 512;
    this.msgLog = new RotatingLogfile(this.dir, 'messages.log', this.maxSize);
    this.errLog = new RotatingLogfile(this.dir, 'errors.log', this.maxSize);
    this.activeLevels = new Map<string, boolean>();
    this.setLogLevel(this.level);
    this.debug("Logger's config");
    this.debug(`LOG_LEVEL: [${this.level}]`);
    this.debug(`LOG_DIR: [${this.dir}]`);
    this.debug(`LOG_MAX_SIZE: [${this.maxSize} kB]`);
  }

  log(message: any, ...optionalParams: any[]): any {
    if (this.activeLevels.get('log') === undefined) return;
    this.msgLog.putMessage(message);
  }

  error(message: any, ...optionalParams: any[]): any {
    if (this.activeLevels.get('error') === undefined) return;
    this.msgLog.putMessage(message);
    this.errLog.putMessage(message);
  }

  warn(message: any, ...optionalParams: any[]): any {
    if (this.activeLevels.get('warn') === undefined) return;
    this.msgLog.putMessage(message);
  }

  debug(message: any, ...optionalParams: any[]): any {
    if (this.activeLevels.get('debug') === undefined) return;
    this.msgLog.putMessage(message);
  }

  verbose(message: any, ...optionalParams: any[]): any {
    if (this.activeLevels.get('verbose') === undefined) return;
    this.msgLog.putMessage(message);
  }

  private setLogLevel(level: string): any {
    const levels = level.split(',');
    levels.filter((l) => {
      return LogLevelNum[l] !== undefined;
    });
    if (levels.length === 1) {
      const level = levels[0];
      this.activeLevels.clear();
      Object.keys(LogLevelNum).forEach((k) => {
        if (LogLevelNum[k] <= LogLevelNum[level]) {
          this.activeLevels.set(k, true);
        }
      });
    }
    if (levels.length > 1) {
      this.activeLevels.clear();
      levels.forEach((level) => {
        this.activeLevels.set(level, true);
      });
    }
  }

  setLogLevels(levels: LogLevel[]): any {
    this.activeLevels.clear();
    levels.forEach((l) => {
      this.activeLevels.set(l, true);
    });
  }
}
