import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { PostService } from './post.service';
import { CreatePost } from './dto';

@UseGuards(JwtGuard)
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('create')
  async CreatePost(@Body() dto: CreatePost) {
    return this.postService.CreatePost(dto);
  }
}
