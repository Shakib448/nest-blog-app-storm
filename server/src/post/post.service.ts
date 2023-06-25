import { Injectable } from '@nestjs/common';
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
      },
    });

    return newPost;
  }

  async UpdatePost(dto: UpdatePost, id: number) {
    const updatePost = await this.prisma.post.update({
      where: {
        id,
      },
      data: dto,
    });

    return updatePost;
  }
}
