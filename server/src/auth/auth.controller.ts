import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser } from './dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async Register(@Body() dto: CreateUser, @Res() res: Response) {
    const token = await this.authService.Register(dto);

    res.status(200).send({ token });
  }

  @Post('login')
  async Login(@Body() dto: CreateUser, @Res() res: Response) {
    const token = await this.authService.Login(dto);

    res.status(200).send({ token });
  }
}
