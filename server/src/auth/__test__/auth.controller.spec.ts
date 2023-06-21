import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { JwtStrategy } from '../strategy';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy, PrismaService, ConfigService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
