import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDtoLogin, AuthDtoRegister } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async Register(@Body() dto: AuthDtoRegister, @Res() res: Response) {
    const { access_token } = await this.authService.Register(dto);

    res
      .cookie('Authorization', access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .send({ status: 'OK' });
  }

  @Post('login')
  async Login(@Body() dto: AuthDtoLogin, @Res() res: Response) {
    const { access_token } = await this.authService.Login(dto);

    res
      .cookie('Authorization', access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .send({ status: 'OK' });
  }
}
