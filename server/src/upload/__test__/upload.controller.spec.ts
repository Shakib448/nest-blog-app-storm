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
    const mockFile = {
      fieldname: 'image',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from('test file'),
      path: 'uploads/9713b88676ed17c1b8c10d3a851a7355f.jpg',
    };

    const response = await controller.FileUpdate(mockFile as any);

    expect(response).toEqual({
      url: `${config.get('BASE_URL')}/${mockFile.path}`,
    });
  });
});
