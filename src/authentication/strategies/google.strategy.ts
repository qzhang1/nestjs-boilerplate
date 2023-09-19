import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { UsersService } from 'src/users/users.service';
import CreateOAuthUserDto from '../dtos/createOAuthUser.dto';
import OAuthProvider from 'src/users/oauthProvider.enum';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthenticationService,
  ) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_AUTH_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { email, displayName, id } = profile;
    const [user, _] = await this.usersService.getByEmail(email);
    if (user) {
      done(null, user);
    } else {
      const newUser = new CreateOAuthUserDto();
      newUser.email = email;
      newUser.oauthProvider = OAuthProvider.Google;
      newUser.oauthProfileId = id;
      newUser.username = displayName;
      const createdUser = await this.authenticationService.createOAuthUser(
        newUser,
      );
      done(null, createdUser);
    }
  }
}
