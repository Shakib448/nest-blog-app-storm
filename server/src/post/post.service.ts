import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePost } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async CreatePost(dto: CreatePost) {
    console.log('Creating post from service', dto);
  }
}
