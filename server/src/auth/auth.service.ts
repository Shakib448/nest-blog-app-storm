import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwt: JwtService,
  ) {}

  async Register(dto: AuthDto) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(dto.password, salt);

    const userExist = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExist) throw new ForbiddenException('User already exists');

    const newUser = await this.prisma.user.create({
      data: { ...dto, password: hash },
    });

    return this.tokenCreate(newUser.id, newUser.email);
  }
  async Login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Incorrect email address!');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch)
      throw new ForbiddenException('Incorrect password written!');

    return this.tokenCreate(user.id, user.email);
  }

  async tokenCreate(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_SECRET'),
    });

    return { access_token };
  }
}
