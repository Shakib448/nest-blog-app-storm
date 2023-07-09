import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDtoLogin, AuthDtoRegister } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async Register(@Body() dto: AuthDtoRegister) {
    return this.authService.Register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async Login(@Body() dto: AuthDtoLogin) {
    return this.authService.Login(dto);
  }
}
