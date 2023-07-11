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

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let config: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

  afterAll(() => {
    app.close();
  });

  describe('E2E testing with authentication', () => {
    it('Should register a user', async () => {
      const user: AuthDtoRegister = {
        username: 'Muktadir',
        email: 'shakiba448@gmail.com',
        password: 'shakib7023',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(user)
        .expect(200);
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

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(403);
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
        .send(user)
        .expect(200);

      await request(app.getHttpServer())
        .get('/user/me')
        .set('Authorization', res.body.user.access_token)
        .expect(200);
    });
  });

  describe('E2E testing with post', () => {
    it('Should create new post as an authenticate user', async () => {
      const user: AuthDtoLogin = {
        email: 'shakiba448@gmail.com',
        password: 'shakib7023',
      };

      const userRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(200);

      const { sub } = jwt.verify(userRes.body.user.access_token, {
        secret: config.get('JWT_SECRET'),
      });

      const createPost: CreatePost = {
        title: 'The test title',
        description: 'The test description',
        userId: sub,
      };

      const response = await request(app.getHttpServer())
        .post('/post/create')
        .set('Authorization', userRes.body.user.access_token)
        .send(createPost)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.title).toEqual(createPost.title);
      expect(response.body.description).toEqual(createPost.description);
      expect(response.body.userId).toBeDefined();
    });

    it('Should update a post as an authenticate user', async () => {
      const user: AuthDtoLogin = {
        email: 'shakiba448@gmail.com',
        password: 'shakib7023',
      };

      const userRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(200);

      const { sub } = jwt.verify(userRes.body.user.access_token, {
        secret: config.get('JWT_SECRET'),
      });

      const createPost: CreatePost = {
        title: 'The test title updated',
        description: 'The test description updated',
        userId: sub,
      };

      const response = await request(app.getHttpServer())
        .post('/post/create')
        .set('Authorization', userRes.body.user.access_token)
        .send(createPost)
        .expect(201);

      const updatePost = await request(app.getHttpServer())
        .patch(`/post/update/${response.body.id}`)
        .set('Authorization', userRes.body.user.access_token)
        .send(createPost)
        .expect(200);

      expect(updatePost.body).toBeDefined();
      expect(updatePost.body.title).toEqual(createPost.title);
      expect(updatePost.body.description).toEqual(createPost.description);
      expect(updatePost.body.userId).toBeDefined();
    });

    it('Should get all posts', async () => {
      const getPosts = await request(app.getHttpServer())
        .get('/post')
        .expect(200);

      expect(getPosts.body).toBeDefined();
      expect(Array.isArray(getPosts.body)).toBe(true);
    });

    it('Should delete a post as an authenticate user', async () => {
      const user: AuthDtoLogin = {
        email: 'shakiba448@gmail.com',
        password: 'shakib7023',
      };

      const userRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(200);

      const { sub } = jwt.verify(userRes.body.user.access_token, {
        secret: config.get('JWT_SECRET'),
      });

      const createPost: CreatePost = {
        title: 'The test title updated',
        description: 'The test description updated',
        userId: sub,
      };

      const response = await request(app.getHttpServer())
        .post('/post/create')
        .set('Authorization', userRes.body.user.access_token)
        .send(createPost)
        .expect(201);

      const deletePost = await request(app.getHttpServer())
        .delete(`/post/delete/${response.body.id}`)
        .set('Authorization', userRes.body.user.access_token)
        .expect(200);

      expect(deletePost.body).toBeDefined();
      expect(deletePost.body.message).toBe('Post deleted successfully');
    });
  });

  describe('E2E testing with comment', () => {
    it('Should create a new comment', async () => {
      const user: AuthDtoLogin = {
        email: 'shakiba448@gmail.com',
        password: 'shakib7023',
      };

      const userRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(200);

      const { sub, username } = jwt.verify(userRes.body.user.access_token, {
        secret: config.get('JWT_SECRET'),
      });

      const createPost: CreatePost = {
        title: 'The test title updated',
        description: 'The test description updated',
        userId: sub,
      };

      const response = await request(app.getHttpServer())
        .post('/post/create')
        .set('Authorization', userRes.body.user.access_token)
        .send(createPost)
        .expect(201);

      const createComment: CreateComment = {
        username,
        comment: 'This is a comment',
        userId: sub,
        postId: response.body.id,
      };

      const comment = await request(app.getHttpServer())
        .post(`/comment/create/${response.body.id}`)
        .set('Authorization', userRes.body.user.access_token)
        .send(createComment)
        .expect(201);

      expect(comment.body).toBeDefined();
      expect(comment.body.username).toBeDefined();
      expect(comment.body.comment).toBeDefined();
      expect(comment.body.userId).toBeDefined();
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
      const user: AuthDtoLogin = {
        email: 'shakiba448@gmail.com',
        password: 'shakib7023',
      };

      const userRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(200);

      const { sub, username } = jwt.verify(userRes.body.user.access_token, {
        secret: config.get('JWT_SECRET'),
      });

      const createPost: CreatePost = {
        title: 'The test title updated',
        description: 'The test description updated',
        userId: sub,
      };

      const response = await request(app.getHttpServer())
        .post('/post/create')
        .set('Authorization', userRes.body.user.access_token)
        .send(createPost)
        .expect(201);

      const createComment: CreateComment = {
        username,
        comment: 'This is a comment',
        userId: sub,
        postId: response.body.id,
      };

      const comment = await request(app.getHttpServer())
        .post(`/comment/create/${response.body.id}`)
        .set('Authorization', userRes.body.user.access_token)
        .send(createComment)
        .expect(201);

      const deleteComment = await request(app.getHttpServer())
        .delete(`/comment/delete/${comment.body.id}`)
        .set('Authorization', userRes.body.user.access_token)
        .expect(200);

      expect(deleteComment.body).toBeDefined();
      expect(deleteComment.body.message).toBe('Comment deleted successfully');
    });
  });
});
