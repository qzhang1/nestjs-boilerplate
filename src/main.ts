import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import Redis from 'ioredis';

import { AppModule } from './app.module';
import { SecretsService } from './secrets.service';
import * as passport from 'passport';

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
  // create redis client and use it as cookie store
  const redisClient = new Redis({
    port: parseInt(configService.get('REDIS_PORT')),
    host: configService.get('REDIS_HOST'),
    password: configService.get('REDIS_PASSWORD'),
  });
  const RedisStore = connectRedis(session);
  const sessionStore = new RedisStore({
    client: redisClient,
  });
  app.use(
    session({
      store: sessionStore,
      secret: secretsService.secrets,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // all day cookie
        maxAge: 24 * 60 * 60 * 1000,
      },
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
