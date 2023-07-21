import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../post.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PostService } from '../post.service';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PrismaService, ConfigService, PostService],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('Should create a new post', async () => {
    const user: any = { id: 1 };
    const dto: any = {
      title: 'Test title',
      description: 'Test description',
    };

    const image: any = { path: 'test/image/path.jpg' };
    const createdPost: any = { id: 1, ...dto };

    jest.spyOn(service, 'CreatePost').mockResolvedValue(createdPost);

    const result = await controller.CreatePost(image, user, dto);

    expect(result).toEqual(createdPost);
    expect(service.CreatePost).toHaveBeenCalledWith(user, {
      ...dto,
      image: `${config.get('BASE_URL')}/${image.path}`,
    });
  });

  it('should return an array of posts', async () => {
    const posts: any = [
      { id: 1, title: 'Post 1', description: 'Description 1' },
      { id: 2, title: 'Post 2', description: 'Description 2' },
    ];

    jest.spyOn(service, 'GetPosts').mockResolvedValue(posts);

    const result = await controller.GetPosts();

    expect(result).toEqual(posts);
    expect(service.GetPosts).toHaveBeenCalled();
  });

  it('should update a post', async () => {
    const postId = 1;
    const updatedPost: any = {
      title: 'Updated Title',
      description: 'Updated Description',
    };
    const image: any = { path: 'test/image/path.jpg' };

    jest.spyOn(service, 'UpdatePost').mockResolvedValue(updatedPost);

    const result = await controller.UpdatePost(image, updatedPost, postId);

    expect(result).toEqual(updatedPost);
    expect(service.UpdatePost).toHaveBeenCalledWith(
      { ...updatedPost, image: `${config.get('BASE_URL')}/${image.path}` },
      postId,
    );
  });

  it('should delete a post', async () => {
    const postId = 1;
    const user: any = { id: 1 };

    jest.spyOn(service, 'DeletePost').mockResolvedValue(user);

    await controller.DeletePost(user, postId);

    expect(service.DeletePost).toHaveBeenCalledWith(user, postId);
  });
});
