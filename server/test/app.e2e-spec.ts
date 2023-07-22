import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDtoLogin, AuthDtoRegister } from '../src/auth/dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreatePost } from '../src/post/dto';
import * as cookieParser from 'cookie-parser';
import { CreateComment } from '../src/comment/dto';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let config: ConfigService;
  let token: string;

  const imagePath = path.join(__dirname, '..', 'assets', 'test.jpg');

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MulterModule.register({
          dest: './uploads',
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    app.use(cookieParser());

    prisma = app.get(PrismaService);
    jwt = app.get(JwtService);
    config = app.get(ConfigService);
    await prisma.cleanDb();
  });

  afterAll(async () => {
    app.close();
    await prisma.cleanDb();
  });

  describe('E2E testing with authentication', () => {
    it('Should register a user', async () => {
      const user: AuthDtoRegister = {
        username: 'Muktadir',
        email: 'shakiba448@gmail.com',
        password: 'shakib7023',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user)
        .expect(200);

      token = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
    });

    it('Should login a user', async () => {
      const user: AuthDtoLogin = {
        email: 'shakiba448@gmail.com',
        password: 'shakib7023',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(200);
    });

    it('Should login error with forbidden', async () => {
      const user: AuthDtoLogin = {
        email: 'shakiba448@gmail.co',
        password: 'shakib70',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(403);

      expect(res.body.error).toBe('Forbidden');
    });

    it('Should update user profile', async () => {
      const user: AuthDtoLogin = {
        email: 'shakiba448@gmail.com',
        password: 'shakib7023',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(200);

      const response = await request(app.getHttpServer())
        .patch('/user/update/profile')
        .type('form')
        .set('Authorization', token)
        .field('username', 'new_user_name')
        .field('description', 'new_user_description')
        .attach('image', imagePath)
        .expect(200);

      expect(response.body.message).toBe('User profile updated successfully!');
    });
  });

  describe('E2E testing with user', () => {
    it('Should return user info', async () => {
      const user: AuthDtoLogin = {
        email: 'shakiba448@gmail.com',
        password: 'shakib7023',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user);

      await request(app.getHttpServer())
        .get('/user/me')
        .set('Authorization', token)
        .expect(200);
    });
  });

  describe('E2E testing with post', () => {
    it('Should create new post as an authenticate user', async () => {
      const createPost: CreatePost = {
        title: 'The test title',
        description: 'The test description',
      };

      const response = await request(app.getHttpServer())
        .post('/post/create')
        .type('form')
        .set('Authorization', token)
        .field('title', createPost.title)
        .field('description', createPost.description)
        .attach('image', imagePath)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.title).toEqual(createPost.title);
      expect(response.body.description).toEqual(createPost.description);
      expect(response.body.image).toEqual(response.body.image);
    });

    it('Should update a post as an authenticate user', async () => {
      const createPost: CreatePost = {
        title: 'The test title updated',
        description: 'The test description updated',
      };

      const response = await request(app.getHttpServer())
        .post('/post/create')
        .type('form')
        .set('Authorization', token)
        .field('title', createPost.title)
        .field('description', createPost.description)
        .attach('image', imagePath)
        .expect(201);

      const updatePost = await request(app.getHttpServer())
        .patch(`/post/update/${response.body.id}`)
        .set('Authorization', token)
        .type('form')
        .field('title', createPost.title)
        .field('description', createPost.description)
        .attach('image', imagePath)
        .expect(200);

      expect(updatePost.body).toBeDefined();
      expect(updatePost.body.title).toEqual(createPost.title);
      expect(updatePost.body.description).toEqual(createPost.description);
      expect(updatePost.body.image).toEqual(updatePost.body.image);
    });

    it('Should get all posts', async () => {
      const getPosts = await request(app.getHttpServer())
        .get('/post')
        .expect(200);

      expect(getPosts.body).toBeDefined();
      expect(Array.isArray(getPosts.body)).toBe(true);
    });

    it('Should delete a post as an authenticate user', async () => {
      const createPost: CreatePost = {
        title: 'The test title updated',
        description: 'The test description updated',
      };

      const response = await request(app.getHttpServer())
        .post('/post/create')
        .set('Authorization', token)
        .type('form')
        .field('title', createPost.title)
        .field('description', createPost.description)
        .attach('image', imagePath)
        .expect(201);

      const deletePost = await request(app.getHttpServer())
        .delete(`/post/delete/${response.body.id}`)
        .set('Authorization', token)
        .expect(200);

      expect(deletePost.body).toBeDefined();
      expect(deletePost.body.message).toBe('Post deleted successfully');
    });
  });

  describe('E2E testing with comment', () => {
    it('Should create a new comment', async () => {
      const { sub, username } = jwt.verify(token, {
        secret: config.get('JWT_SECRET'),
      });

      const createPost: CreatePost = {
        title: 'The test title updated',
        description: 'The test description updated',
      };

      const response = await request(app.getHttpServer())
        .post('/post/create')
        .set('Authorization', token)
        .type('form')
        .field('title', createPost.title)
        .field('description', createPost.description)
        .attach('image', imagePath)
        .expect(201);

      const createComment: CreateComment = {
        comment: 'This is a comment',
        userId: sub,
        postId: response.body.id,
      };

      const comment = await request(app.getHttpServer())
        .post(`/comment/create/${response.body.id}`)
        .set('Authorization', token)
        .send(createComment)
        .expect(201);

      expect(comment.body).toBeDefined();
      expect(comment.body.comment).toBeDefined();
      expect(comment.body.postId).toBeDefined();
    });

    it('Should get all comments', async () => {
      const getComments = await request(app.getHttpServer())
        .get('/comment')
        .expect(200);

      expect(getComments.body).toBeDefined();
      expect(Array.isArray(getComments.body)).toBe(true);
    });

    it('Should delete a comment as an authenticate user', async () => {
      const { sub, username } = jwt.verify(token, {
        secret: config.get('JWT_SECRET'),
      });

      const createPost: CreatePost = {
        title: 'The test title updated',
        description: 'The test description updated',
      };

      const response = await request(app.getHttpServer())
        .post('/post/create')
        .set('Authorization', token)
        .type('form')
        .field('title', createPost.title)
        .field('description', createPost.description)
        .attach('image', imagePath)

        .expect(201);

      const createComment: CreateComment = {
        comment: 'This is a comment',
        userId: sub,
        postId: response.body.id,
      };

      const comment = await request(app.getHttpServer())
        .post(`/comment/create/${response.body.id}`)
        .set('Authorization', token)
        .send(createComment)
        .expect(201);

      const deleteComment = await request(app.getHttpServer())
        .delete(`/comment/delete/${comment.body.id}`)
        .set('Authorization', token)
        .expect(200);

      expect(deleteComment.body).toBeDefined();
      expect(deleteComment.body.message).toBe('Comment deleted successfully');
    });
  });

  describe('Logout E2E', () => {
    it('should log out work', async () => {
      const res = await request(app.getHttpServer()).post('/auth/logout');
      expect(res.body.message).toBe('Log out successfully');
    });
  });
});
