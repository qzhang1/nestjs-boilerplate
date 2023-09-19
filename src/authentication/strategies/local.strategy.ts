import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../services/authentication.service';
import { Injectable } from '@nestjs/common';
import User from '../../users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, pwd: string): Promise<User> {
    return this.authenticationService.getAuthenticatedUser(email, pwd);
  }
}
