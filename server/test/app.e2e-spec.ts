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

  describe('E2E testing Authentication', () => {
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

  describe('Get user info', () => {
    it('Should return user info', async () => {
      const user: AuthDtoLogin = {
        email: 'shakiba448@gmail.com',
        password: 'shakib7023',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(200);

      const token = res.headers['set-cookie'][0].split(';')[0].split('=')[1];

      await request(app.getHttpServer())
        .get('/user/me')
        .set('Authorization', token)
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

      const token = userRes.headers['set-cookie'][0]
        .split(';')[0]
        .split('=')[1];

      const { sub } = jwt.verify(token, {
        secret: config.get('JWT_SECRET'),
      });

      const createPost: CreatePost = {
        title: 'The test title',
        description: 'The test description',
        userId: sub,
      };

      const response = await request(app.getHttpServer())
        .post('/post/create')
        .set('Authorization', token)
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

      const token = userRes.headers['set-cookie'][0]
        .split(';')[0]
        .split('=')[1];

      const { sub } = jwt.verify(token, {
        secret: config.get('JWT_SECRET'),
      });

      const createPost: CreatePost = {
        title: 'The test title updated',
        description: 'The test description updated',
        userId: sub,
      };

      const response = await request(app.getHttpServer())
        .post('/post/create')
        .set('Authorization', token)
        .send(createPost)
        .expect(201);

      const updatePost = await request(app.getHttpServer())
        .patch(`/post/update/${response.body.id}`)
        .set('Authorization', token)
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

      const token = userRes.headers['set-cookie'][0]
        .split(';')[0]
        .split('=')[1];

      const { sub } = jwt.verify(token, {
        secret: config.get('JWT_SECRET'),
      });

      const createPost: CreatePost = {
        title: 'The test title updated',
        description: 'The test description updated',
        userId: sub,
      };

      const response = await request(app.getHttpServer())
        .post('/post/create')
        .set('Authorization', token)
        .send(createPost)
        .expect(201);

      const deletePost = await request(app.getHttpServer())
        .delete(`/post/delete/${response.body.id}`)
        .set('Authorization', token)
        .send(createPost)
        .expect(200);

      expect(deletePost.body).toBeDefined();
      expect(deletePost.body.message).toBe('Post deleted successfully');
    });
  });
});
