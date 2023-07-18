import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from '../upload.controller';
import { ConfigService } from '@nestjs/config';

describe('UploadController', () => {
  let controller: UploadController;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [ConfigService],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should upload a file successfully', async () => {
    const mockFile: any = {
      fieldname: 'image',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from('test file'),
      path: 'uploads/test.jpg',
    };

    const response = await controller.FileUpdate(mockFile);

    expect(response).toEqual({
      url: `${config.get('BASE_URL')}/${mockFile.path}`,
    });
  });
});
