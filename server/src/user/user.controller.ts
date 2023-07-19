import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { UpdateCredentials, UpdateProfile } from './dto';
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch('update/credentials')
  updatePassword(@GetUser() user: User, @Body() dto: UpdateCredentials) {
    return this.userService.updatePassword(user, dto);
  }

  @Patch('update/profile')
  updateProfile(@GetUser() user: User, @Body() dto: UpdateProfile) {}
}
