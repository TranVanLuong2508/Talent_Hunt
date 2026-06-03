import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { S3Client } from '@aws-sdk/client-s3';
import { ApiConfigService } from '@/shared';

@Module({
  imports: [],
  controllers: [S3Controller],
  providers: [
    {
      provide: S3Client,
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => {
        const config = configService.S3ServiceConfig;
        return new S3Client({
          region: config.region,
          credentials: {
            accessKeyId: config.access_key,
            secretAccessKey: config.secret_key,
          },
        });
      },
    },
    S3Service,
  ],
  exports: [S3Client],
})
export class S3Module {}
