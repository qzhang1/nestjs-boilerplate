import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './user.entity';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async queryByHandler(
    field: string,
    value: string,
  ): Promise<[User | null, HttpException | null]> {
    try {
      const user = await this.userRepository.findOneBy({ [field]: value });
      if (user) {
        return [user, null];
      }
      return [
        null,
        new HttpException(
          `user of field ${field} does not exists`,
          HttpStatus.NOT_FOUND,
        ),
      ];
    } catch (err: unknown) {
      return [
        null,
        new HttpException(
          'unexpectedly failed to query user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      ];
    }
  }

  async getByEmail(email: string) {
    return await this.queryByHandler('email', email);
  }

  async getByUsername(username: string) {
    return await this.queryByHandler('username', username);
  }

  async getById(id: string) {
    return await this.queryByHandler('id', id);
  }

  async create(userData: CreateUserDto) {
    const newUser = this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  }
}
