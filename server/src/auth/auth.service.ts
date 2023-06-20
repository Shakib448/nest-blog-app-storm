import { Injectable } from '@nestjs/common';
import { CreateUser } from './dto';

@Injectable()
export class AuthService {
  async Register(dto: CreateUser) {}
  async Login(dto: CreateUser) {}
}
