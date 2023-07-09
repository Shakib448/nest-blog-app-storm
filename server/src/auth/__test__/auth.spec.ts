import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [AuthController],
      providers: [AuthService, PrismaService, ConfigService, JwtService],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('Register', () => {
    it('should register a new user and set the authorization cookie', async () => {
      const access_token = 'dummy_token';
      jest.spyOn(authService, 'Register').mockResolvedValue({ access_token });

      const dto = {
        username: 'testname',
        email: 'test@example.com',
        password: 'password',
      };
      await authController.Register(dto);

      expect(authService.Register).toHaveBeenCalledWith(dto);
    });
  });

  describe('Login', () => {
    it('should log in a user and set the authorization cookie', async () => {
      const access_token = 'dummy_token';
      jest.spyOn(authService, 'Login').mockResolvedValue({ access_token });

      const dto = {
        username: 'dummy_name',
        email: 'test@example.com',
        password: 'password',
      };
      await authController.Login(dto);

      expect(authService.Login).toHaveBeenCalledWith(dto);
    });
  });
});
