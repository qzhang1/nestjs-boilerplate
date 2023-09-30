import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CookieAuthenticationGuard } from 'src/authentication/guards/cookieAuthentication.guard';

@UseGuards(CookieAuthenticationGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }
}
