import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDtoLogin, AuthDtoRegister } from '../src/auth/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
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
});
