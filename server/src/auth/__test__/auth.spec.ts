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

  describe('Login', () => {
    it('should login  and set the authorization cookie', async () => {
      const access_token = 'dummy_token';
      jest.spyOn(service, 'Login').mockResolvedValue({ access_token });

      const res: any = {
        cookie: jest.fn((name, value, options) => {
          res.cookieData = { name, value, options };
          return res;
        }),
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      const dto = { email: 'test@example.com', password: 'password' };
      await controller.Login(dto, res);

      expect(service.Login).toHaveBeenCalledWith(dto);

      expect(res.cookie).toHaveBeenCalledWith('Authorization', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: expect.any(Date),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ status: 'OK' });

      const { name, value, options } = res.cookieData;
      expect(name).toBe('Authorization');
      expect(value).toBe(access_token);
      expect(options.httpOnly).toBe(true);
      expect(options.secure).toBe(false);
      expect(options.sameSite).toBe('lax');
      expect(options.expires).toBeInstanceOf(Date);
    });
  });
});
