// logger/logger.module.ts
import { Global, Module } from '@nestjs/common';
import { LogService } from './log.service';

@Global()
@Module({
  providers: [LogService],
  exports: [LogService], // Export the logger service to be used in other modules
})
export class LoggerModule {}
