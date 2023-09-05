import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SecretsService } from './secrets.service';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // loads all dependencies (modules, providers, dep graph)
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // transform payload body to desired DTO
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const secretsService = app.get(SecretsService);
  const configService = app.get(ConfigService);
  app.use(
    session({
      secret: secretsService.secrets,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  let appPort = parseInt(configService.get('APP_PORT'));
  if (isNaN(appPort)) {
    appPort = 3000;
  }
  await app.listen(appPort);
}
bootstrap();
