import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { LogService } from './log/log.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LogService) private readonly logger: LogService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
