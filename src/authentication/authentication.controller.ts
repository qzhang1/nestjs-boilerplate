import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './services/authentication.service';
import CreateUserDto from 'src/authentication/dtos/createUser.dto';
import RequestWithUser from 'src/users/types/requestWithuser.interface';
import { LogInWithCredentialsGuard } from './guards/loginWithCredentials.guard';
import { CookieAuthenticationGuard } from './guards/cookieAuthentication.guard';
import { GoogleOAuthGuard } from './guards/googleOAuth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor) // makes sure any serialzation options like @Exclude is enforced
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() registrationData: CreateUserDto,
    @Res() res: Response,
  ) {
    await this.authenticationService.register(registrationData);
    res.status(HttpStatus.CREATED).send();
  }

  @UseGuards(LogInWithCredentialsGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser, @Res() res: Response) {
    res.sendStatus(HttpStatus.OK);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleLogin() {}

  @Get('google/cb')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleOAuthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    req.session.passport = {
      user: req.user.id,
    };
    res.sendStatus(200);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(CookieAuthenticationGuard)
  @Get('me')
  async me(@Req() req) {
    return req.user;
  }
}
