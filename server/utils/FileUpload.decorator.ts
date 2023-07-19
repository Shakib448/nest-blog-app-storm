import {
  applyDecorators,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export function FileUploadInterceptor(fieldName: string) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            callback(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }),
    ),
  );
}
