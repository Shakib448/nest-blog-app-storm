import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from '../auth/guard';
import { FileUploadInterceptor } from '../../utils/FileUpload.decorator';

@UseGuards(JwtGuard)
@Controller('upload')
export class UploadController {
  constructor(private config: ConfigService) {}

  @Post()
  @FileUploadInterceptor('image')
  async FileUpdate(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1.5 * 1000 * 1024 }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return { url: `${this.config.get('BASE_URL')}/${image.path}` };
  }
}
