import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { PostService } from './post.service';
import { CreatePost, UpdatePost } from './dto';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { FileUploadInterceptor } from '../../utils/FileUpload.decorator';

@Controller('post')
export class PostController {
  constructor(
    private postService: PostService,
    private config: ConfigService,
  ) {}

  @UseGuards(JwtGuard)
  @Post('create')
  @FileUploadInterceptor('image')
  CreatePost(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1.5 * 1000 * 1024 }),
        ],
      }),
    )
    image: Express.Multer.File,
    @GetUser() user: User,
    @Body() dto: CreatePost,
  ) {
    return this.postService.CreatePost(user, {
      ...dto,
      image: `${this.config.get('BASE_URL')}/${image.path}`,
    });
  }

  @Get()
  GetPosts() {
    return this.postService.GetPosts();
  }

  @UseGuards(JwtGuard)
  @Patch('update/:id')
  @FileUploadInterceptor('image')
  UpdatePost(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1.5 * 1000 * 1024 }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() dto: UpdatePost,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postService.UpdatePost(
      {
        ...dto,
        image: `${this.config.get('BASE_URL')}/${image.path}`,
      },
      id,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  DeletePost(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.postService.DeletePost(user, id);
  }
}
