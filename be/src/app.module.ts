import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { CloudModule } from './modules/cloud/cloud.module';
import { S3Module } from './modules/s3/s3.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { UnitsModule } from './modules/units/units.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
    AuthenticationModule,
    CloudModule,
    S3Module,
    PrismaModule,
    UserModule,
    UnitsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
