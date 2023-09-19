import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { PasswordComplexityService } from './services/password-complexity.service';
import { LocalSerializer } from './strategies/local.serializer';
import { GoogleStrategy } from './strategies/google.strategy';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/users/user.entity';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    PasswordComplexityService,
    LocalStrategy,
    LocalSerializer,
    GoogleStrategy,
    UsersService,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
