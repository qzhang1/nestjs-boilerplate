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
import { AuthenticationService } from './authentication.service';
import CreateUserDto from 'src/users/dto/createUser.dto';
import RequestWithUser from 'src/users/types/requestWithuser.interface';
import { LogInWithCredentialsGuard } from './guards/loginWithCredentials.guard';
import { CookieAuthenticationGuard } from './guards/cookieAuthentication.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor) // makes sure any serialzation options like @Exclude is enforced
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @HttpCode(201)
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
  async login(@Req() request: RequestWithUser, @Res() res: Response) {
    res.status(HttpStatus.OK).send();
  }

  @HttpCode(200)
  @UseGuards(CookieAuthenticationGuard)
  @Get('me')
  async me(@Req() request) {
    return request.user;
  }
}
