import {
  ConsoleLogger,
  ConsoleLoggerOptions,
  Injectable,
  LogLevel,
  Optional,
} from '@nestjs/common';
import { RotatingLogfile } from './rotating-logfile';

enum LogLevelNum {
  log,
  error,
  warn,
  debug,
  verbose,
}

@Injectable()
export class LogService extends ConsoleLogger {
  // implements LoggerService {
  private readonly level: string;
  private readonly dir: string;
  private readonly maxSize: number;
  private msgLog: RotatingLogfile;
  private errLog: RotatingLogfile;
  // private activeLevels: Map<string, boolean>;

  constructor();
  constructor(context: string);
  constructor(context: string, options: ConsoleLoggerOptions);
  constructor(
    @Optional()
    protected context?: string,
    @Optional()
    protected options: ConsoleLoggerOptions = {},
  ) {
    super(context, options);
    this.level = process.env['LOG_LEVEL'] ?? 'error';
    this.dir = process.env['LOG_DIR'] ?? '/var/log/rsschool';
    this.maxSize = process.env['LOG_MAX_SIZE']
      ? parseInt(process.env['LOG_MAX_SIZE'])
      : 512;
    this.msgLog = new RotatingLogfile(this.dir, 'messages.log', this.maxSize);
    this.errLog = new RotatingLogfile(this.dir, 'errors.log', this.maxSize);
    // this.activeLevels = new Map<string, boolean>();
    this.setLogLevel(this.level);
    this.debug("Logger's config:");
    this.debug(`LOG_LEVEL: [${this.level}]`);
    this.debug(`LOG_DIR: [${this.dir}]`);
    this.debug(`LOG_MAX_SIZE: [${this.maxSize} kB]`);
  }

  // log(message: any, ...optionalParams: any[]): any {
  //   if (this.activeLevels.get('log') === undefined) return;
  //   const msg = this.buildMessage(message, optionalParams);
  //   this.msgLog.putMessage(msg);
  // }

  // error(message: any, ...optionalParams: any[]): any {
  //   if (this.activeLevels.get('error') === undefined) return;
  //   const msg = this.buildMessage(message, optionalParams);
  //   this.msgLog.putMessage(msg);
  //   this.errLog.putMessage(msg);
  // }

  // warn(message: any, ...optionalParams: any[]): any {
  //   if (this.activeLevels.get('warn') === undefined) return;
  //   const msg = this.buildMessage(message, optionalParams);
  //   this.msgLog.putMessage(msg);
  // }

  // debug(message: any, ...optionalParams: any[]): any {
  //   if (this.activeLevels.get('debug') === undefined) return;
  //   const msg = this.buildMessage(message, optionalParams);
  //   this.msgLog.putMessage(msg);
  // }

  // verbose(message: any, ...optionalParams: any[]): any {
  //   if (this.activeLevels.get('verbose') === undefined) return;
  //   const msg = this.buildMessage(message, optionalParams);
  //   this.msgLog.putMessage(msg);
  // }

  // private buildMessage(message: any, ...optionalParams: any[]): string {
  //   console.log(optionalParams);
  //   let msg = '';
  //   msg =
  //     msg + (typeof message === 'string' ? message : JSON.stringify(message));
  //   if (!!optionalParams) {
  //     optionalParams.forEach((p) => {
  //       if (!!p) {
  //         msg = msg + ', ' + (typeof p === 'string' ? p : JSON.stringify(p));
  //       }
  //     });
  //   }

  //   return msg;
  // }

  protected printMessages(
    messages: unknown[],
    context = '',
    logLevel: LogLevel = 'log',
    writeStreamType?: 'stdout' | 'stderr',
  ) {
    messages.forEach((message) => {
      const pidMessage = this.formatPid(process.pid);
      const contextMessage = this.formatContext(context);
      const timestampDiff = this.updateAndGetTimestampDiff();
      const formattedLogLevel = logLevel.toUpperCase().padStart(7, ' ');
      const formattedMessage = this.formatMessage(
        logLevel,
        message,
        pidMessage,
        formattedLogLevel,
        contextMessage,
        timestampDiff,
      );

      this.msgLog.putMessage(formattedMessage);
      if (logLevel === 'error') {
        this.errLog.putMessage(formattedMessage);
      }

      process[writeStreamType ?? 'stdout'].write(formattedMessage);
    });
  }

  protected colorize(message: string, logLevel: LogLevel) {
    return logLevel === 'log' ? message : message; //  get rid of "npm run lint" error
  }

  protected formatContext(context: string): string {
    return context ? `[${context}] ` : '';
  }

  private setLogLevel(level: string): any {
    const levels = level.split(',');
    const logLevels = new Array<LogLevel>();
    levels.filter((l) => {
      return LogLevelNum[l] !== undefined;
    });
    if (levels.length === 1) {
      const level = levels[0];
      // this.activeLevels.clear();
      Object.keys(LogLevelNum).forEach((k) => {
        if (LogLevelNum[k] <= LogLevelNum[level]) {
          // this.activeLevels.set(k, true);
          logLevels.push(<LogLevel>k);
        }
      });
    }
    if (levels.length > 1) {
      // this.activeLevels.clear();
      levels.forEach((level) => {
        // this.activeLevels.set(level, true);
        logLevels.push(<LogLevel>level);
      });
    }
    this.setLogLevels(logLevels);
  }

  // setLogLevels(levels: LogLevel[]): any {
  //   this.activeLevels.clear();
  //   levels.forEach((l) => {
  //     this.activeLevels.set(l, true);
  //   });
  // }
}
