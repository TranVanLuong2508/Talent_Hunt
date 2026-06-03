import { ApiConfigService } from '@/shared';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly bucketName: string;
  constructor(
    private readonly s3Client: S3Client,
    private readonly configService: ApiConfigService,
  ) {
    this.bucketName = this.configService.S3ServiceConfig.bucket_name;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `uploads/memes/${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName, //bucket name
      Key: key, //file path in bucket
      Body: file.buffer, // file content
      ContentType: file.mimetype, // file type
    });

    try {
      // await this.s3Client.send(command);
      // return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
      await this.s3Client.send(command);

      const getObjectCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, getObjectCommand, {
        expiresIn: 3600,
      });

      return signedUrl;
    } catch (error: any) {
      console.log('Check error', error);
      throw new InternalServerErrorException('S3 error', error);
    }
  }
}
