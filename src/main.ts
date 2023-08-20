import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LogService } from './log/log.service';

dotenv.config();

const port = process.env['PORT'] ?? 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(LogService));

  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('The Home Library Service')
    .setDescription('The Home Library Service API description')
    .setVersion('1.0')
    .addTag('library')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  Logger.log(`Server started on port [${port}]`);
}
bootstrap();
