import { CommentService } from './../comment.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from '../comment.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('CommentController', () => {
  let controller: CommentController;
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [CommentService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('Should create a new comment', async () => {
    const user: any = { id: 1 };
    const dto: any = {
      username: 'test',
      comment: 'test comment',
      userId: 1,
      postId: 1,
    };
    const param: any = { id: '1' };

    jest.spyOn(service, 'CreateComment').mockResolvedValue(dto);

    const result = await service.CreateComment(user, dto, param);

    expect(result).toEqual(dto);
    expect(service.CreateComment).toHaveBeenCalledWith(user, dto, param);
  });

  it('should return an array of comments', async () => {
    const comments: any = [
      { id: 1, username: 'test 1', comment: 'comment 1', userId: 1, postId: 1 },
      { id: 2, username: 'test 2', comment: 'comment 2', userId: 2, postId: 2 },
    ];

    jest.spyOn(service, 'GetComment').mockResolvedValue(comments);

    const result = await controller.GetComment();

    expect(result).toEqual(comments);
    expect(service.GetComment).toHaveBeenCalled();
  });

  it('should delete a comment', async () => {
    const commentId: number = 1;
    const user: any = { id: 1 };

    jest.spyOn(service, 'DeleteComment').mockResolvedValue(user);

    await controller.DeleteComment(user, commentId);

    expect(service.DeleteComment).toHaveBeenCalledWith(user, commentId);
  });
});
