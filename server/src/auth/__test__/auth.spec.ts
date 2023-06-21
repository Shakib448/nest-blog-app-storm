import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { JwtStrategy } from '../strategy';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy, PrismaService, ConfigService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('AuthController', () => {
    it('Controller should be define', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('AuthService', () => {
    it('Service should be define', () => {
      expect(service).toBeDefined();
    });
  });
});
