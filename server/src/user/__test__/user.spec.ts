import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('getMe', () => {
    it('should return the user object', async () => {
      const dummyUser: any = {
        id: 1,
        email: 'shakiba448@gmail.com',
        password: 'password123',
      };

      const result = controller.getMe(dummyUser);

      expect(result).toEqual(dummyUser);
    });
  });
});
