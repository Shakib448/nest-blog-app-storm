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

      const res: any = {
        cookie: jest.fn((name, value, options) => {
          res.cookieData = { name, value, options };
          return res;
        }),
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      const dto = {
        username: 'testname',
        email: 'test@example.com',
        password: 'password',
      };
      await authController.Register(dto, res);

      expect(authService.Register).toHaveBeenCalledWith(dto);

      expect(res.cookie).toHaveBeenCalledWith('Authorization', access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: expect.any(Date),
      });
      expect(res.status).toHaveBeenCalledWith(200);

      const { name, value, options } = res.cookieData;
      expect(name).toBe('Authorization');
      expect(value).toBe(access_token);
      expect(options.httpOnly).toBe(true);
      expect(options.secure).toBe(true);
      expect(options.sameSite).toBe('lax');
      expect(options.expires).toBeInstanceOf(Date);
    });
  });

  describe('Login', () => {
    it('should log in a user and set the authorization cookie', async () => {
      const access_token = 'dummy_token';
      jest.spyOn(authService, 'Login').mockResolvedValue({ access_token });

      const res: any = {
        cookie: jest.fn((name, value, options) => {
          res.cookieData = { name, value, options };
          return res;
        }),
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      const dto = {
        username: 'dummy_name',
        email: 'test@example.com',
        password: 'password',
      };
      await authController.Login(dto, res);

      expect(authService.Login).toHaveBeenCalledWith(dto);

      expect(res.cookie).toHaveBeenCalledWith('Authorization', access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: expect.any(Date),
      });
      expect(res.status).toHaveBeenCalledWith(200);

      const { name, value, options } = res.cookieData;
      expect(name).toBe('Authorization');
      expect(value).toBe(access_token);
      expect(options.httpOnly).toBe(true);
      expect(options.secure).toBe(true);
      expect(options.sameSite).toBe('lax');
      expect(options.expires).toBeInstanceOf(Date);
    });
  });

  describe('Logout', () => {
    it('should logout and clear the authorization token', async () => {
      const res: any = {
        clearCookie: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await authController.Logout(res);

      expect(res.send).toHaveBeenCalledWith({
        message: 'Log out successfully',
      });
      expect(res.clearCookie).toHaveBeenCalledWith('Authorization');
    });
  });
});
