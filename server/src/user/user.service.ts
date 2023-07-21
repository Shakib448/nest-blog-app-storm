import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateCredentials, UpdateProfile } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updatePassword(user: User, dto: UpdateCredentials) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userExists) throw new ForbiddenException('User not found!');

    const passwordMatch = await bcrypt.compare(
      dto.currentPassword,
      userExists.password,
    );

    if (!passwordMatch) {
      throw new ForbiddenException('Current Password does not match!');
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(dto.newPassword, salt);

    const updatePassword = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hash,
      },
    });

    if (!updatePassword)
      throw new InternalServerErrorException('Internal Server Error');

    return { message: 'Password changed successfully!' };
  }

  async updateProfile(user: User, dto: UpdateProfile) {
    const userExits = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userExits) throw new ForbiddenException('User not found!');

    const updateUser = await this.prisma.user.update({
      where: { id: user.id },
      data: dto,
    });

    if (!updateUser)
      throw new InternalServerErrorException('Internal Server Error');

    return { message: 'User profile updated successfully!' };
  }
}
