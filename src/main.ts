import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as passport from 'passport';
import Redis from 'ioredis';
// internal project deps
import { AppModule } from './app.module';
import { SecretsService } from './secrets.service';

async function bootstrap() {
  // loads all dependencies (modules, providers, dep graph)
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  // validates the request body according to DTO metadata
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // serializes the DTOs and will expose/exclude certain properties
  // according to class-transformer metadata
  // app.useGlobalInterceptors(
  //   new ClassSerializerInterceptor(
  //     app.get(Reflector)
  //   )
  // );
  if (configService.get('FRONT_END_URL')) {
    console.log(configService.get('FRONT_END_URL'));
    app.enableCors({
      origin: configService.get('FRONT_END_URL'),
      credentials: false,
    });
  }

  const secretsService = app.get(SecretsService);
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
