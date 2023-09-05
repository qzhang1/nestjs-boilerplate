import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import CreateUserDto from 'src/users/dto/createUser.dto';
import RequestWithUser from 'src/users/types/requestWithuser.interface';
import { LogInWithCredentialsGuard } from './guards/loginWithCredentials.guard';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor) // makes sure any serialzation options like @Exclude is enforced
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @HttpCode(201)
  @Post('register')
  async register(@Body() registrationData: CreateUserDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LogInWithCredentialsGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    return request.user;
  }

  @HttpCode(200)
  @UseGuards()
  @Get()
  async authenticate(@Req() request) {
    return request.user;
  }
}
