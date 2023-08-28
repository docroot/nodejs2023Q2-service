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
  private readonly level: string;
  private readonly dir: string;
  private readonly maxSize: number;
  private msgLog: RotatingLogfile;
  private errLog: RotatingLogfile;

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
    this.setLogLevel(this.level);
    this.debug("Logger's config:");
    this.debug(`LOG_LEVEL: [${this.level}]`);
    this.debug(`LOG_DIR: [${this.dir}]`);
    this.debug(`LOG_MAX_SIZE: [${this.maxSize} kB]`);
  }

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
      Object.keys(LogLevelNum).forEach((k) => {
        if (LogLevelNum[k] <= LogLevelNum[level]) {
          logLevels.push(<LogLevel>k);
        }
      });
    }
    if (levels.length > 1) {
      levels.forEach((level) => {
        logLevels.push(<LogLevel>level);
      });
    }
    this.setLogLevels(logLevels);
  }
}
