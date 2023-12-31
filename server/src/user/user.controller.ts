import {
  Body,
  Controller,
  Get,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { UpdateCredentials, UpdateProfile } from './dto';
import { FileUploadInterceptor } from '../../utils/FileUpload.decorator';
import { ConfigService } from '@nestjs/config';
import { ImageValidator } from '../../utils/Image.validator';
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private config: ConfigService,
  ) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch('update/credentials')
  updatePassword(@GetUser() user: User, @Body() dto: UpdateCredentials) {
    return this.userService.updatePassword(user, dto);
  }

  @Patch('update/profile')
  @FileUploadInterceptor('image')
  updateProfile(
    @UploadedFile(new ParseFilePipe(ImageValidator))
    image: Express.Multer.File,
    @GetUser() user: User,
    @Body() dto: UpdateProfile,
  ) {
    return this.userService.updateProfile(user, {
      ...dto,
      image: image
        ? `${this.config.get('BASE_URL')}/${image.path}`
        : user.image,
    });
  }
}
