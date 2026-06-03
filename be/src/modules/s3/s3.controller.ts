import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = await this.s3Service.uploadFile(file);
    return {
      message: 'Upload file successfully',
      url: fileUrl,
    };
  }
}
