import { FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';

export const ImageValidator = {
  validators: [
    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    new MaxFileSizeValidator({
      maxSize: 1.5 * 1000 * 1024,
      message: 'File size must be less than 1.5MB',
    }),
  ],
  fileIsRequired: false,
};
