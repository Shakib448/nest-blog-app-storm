import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComment } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async CreateComment(user: User, dto: CreateComment, id: number) {
    const postExits = await this.prisma.post.findUnique({ where: { id } });

    if (!postExits) throw new ForbiddenException('Post not found');

    const newComment = await this.prisma.comment.create({
      data: {
        comment: dto.comment,
        postId: postExits.id,
        userId: user.id,
      },
    });

    return newComment;
  }

  async GetComment() {
    const data = await this.prisma.comment.findMany({
      include: { user: { select: { id: true, username: true, image: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return data;
  }

  async DeleteComment(user: User, id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { user: { select: { id: true } } },
    });

    if (!comment) throw new ForbiddenException('Comment not found!');

    if (comment.userId !== user.id)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.comment.delete({ where: { id } });

    return { message: 'Comment deleted successfully' };
  }
}
