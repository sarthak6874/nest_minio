import { Module } from '@nestjs/common';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MinioClientModule } from './minio-client/minio-client.module';

@Module({
  imports: [FileUploadModule,MinioClientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
