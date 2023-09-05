import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import { PasswordComplexityService } from './password-complexity.service';

@Module({
  imports: [UsersModule, ConfigModule, PassportModule],
  providers: [AuthenticationService, LocalStrategy, PasswordComplexityService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
