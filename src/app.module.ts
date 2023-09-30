import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import * as Joi from 'joi';
import { SecretsService } from './secrets.service';
import { join } from 'path';
import { HealthModule } from './health/health.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV !== 'production'
          ? join(__dirname, '..', 'development.env')
          : join(__dirname, '..', 'production.env'),
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_AUTH_CALLBACK_URL: Joi.string().required(),
        APP_PORT: Joi.number().required(),
        APP_MAX_HEAP_LIMIT: Joi.number().default(314572800),
        APP_MAX_RSS_LIMIT: Joi.number().default(314572800),
        APP_DISK_STORAGE_PCT: Joi.number().min(0).max(1).default(0.4),
        FRONT_END_URL: Joi.string(),
        SESSION_SECRETS: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    HealthModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SecretsService],
})
export class AppModule {}
