import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePost, UpdatePost } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async CreatePost(user: User, dto: CreatePost) {
    const newPost = await this.prisma.post.create({
      data: {
        title: dto.title,
        description: dto.description,
        userId: user.id,
        image: dto.image,
      },
    });

    return newPost;
  }

  async GetPosts() {
    const posts = await this.prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            image: true,
          },
        },
        comment: true,
      },
    });

    return posts;
  }

  async UpdatePost(dto: UpdatePost, id: number) {
    const updatePost = await this.prisma.post.update({
      where: { id },
      data: dto,
    });

    return updatePost;
  }

  async DeletePost(user: User, id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) throw new ForbiddenException('Post not found!');

    if (post.userId !== user.id)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.comment.deleteMany({ where: { postId: post.id } });
    await this.prisma.post.delete({ where: { id: post.id } });

    return { message: 'Post deleted successfully' };
  }
}
