import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreateUserDto from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { PasswordComplexityService } from './password-complexity.service';

enum PostgresErrorCode {
  UniqueViolation = '23505',
}

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly passwordComplexity: PasswordComplexityService,
    private readonly userService: UsersService,
  ) {}

  public async register(registerData: CreateUserDto) {
    const validationError = this.passwordComplexity.validate(
      registerData.password,
    );
    if (validationError) {
      throw new HttpException(validationError, HttpStatus.BAD_REQUEST);
    }
    const hashedPwd = await bcrypt.hash(registerData.password, 10);
    registerData.password = hashedPwd;
    try {
      const createdUser = await this.userService.create(registerData);
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'unexpected error registering user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getAuthenticatedUser(email: string, pwd: string) {
    try {
      const [user, queryError] = await this.userService.getByEmail(email);
      if (queryError) {
        throw queryError;
      }
      await this.verifyPassword(pwd, user.password);
      return user;
    } catch (error) {
      throw new HttpException('failed to get user', HttpStatus.BAD_REQUEST);
    }
  }

  private async verifyPassword(pwd: string, hashedPwd: string) {
    const isPwdMatching = await bcrypt.compare(pwd, hashedPwd);
    if (!isPwdMatching) {
      throw new HttpException('Invalid credential', HttpStatus.BAD_REQUEST);
    }
  }
}
