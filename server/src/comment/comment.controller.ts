import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtGuard } from '../auth/guard';
import { CreateComment } from './dto';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtGuard)
  @Post('create/:id')
  CreateComment(
    @GetUser() user: User,
    @Body() dto: CreateComment,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commentService.CreateComment(user, dto, id);
  }

  @Get()
  GetComment() {
    return this.commentService.GetComment();
  }

  @UseGuards(JwtGuard)
  @Delete('delete/:id')
  DeleteComment(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.commentService.DeleteComment(user, id);
  }
}
