import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { PostService } from './post.service';
import { CreatePost, UpdatePost } from './dto';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtGuard)
  @Post('create')
  CreatePost(@GetUser() user: User, @Body() dto: CreatePost) {
    return this.postService.CreatePost(user, dto);
  }

  @Get()
  GetPosts() {
    return this.postService.GetPosts();
  }

  @UseGuards(JwtGuard)
  @Patch('update/:id')
  UpdatePost(@Body() dto: UpdatePost, @Param('id', ParseIntPipe) id: number) {
    return this.postService.UpdatePost(dto, id);
  }
}
