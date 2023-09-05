import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import User from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    const user = await this.usersService.getById(userId);
    done(null, user);
  }
}
