import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import Post from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<Post[]> {
    const response = await firstValueFrom(
      this.httpService.get('https://jsonplaceholder.typicode.com/posts'),
    );
    return response.data;
  }

  async findOne(id: number): Promise<Post> {
    const response = await firstValueFrom(
      this.httpService.get(`https://jsonplaceholder.typicode.com/posts/${id}`),
    );
    return response.data;
  }
}
