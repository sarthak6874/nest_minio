import { Module } from '@nestjs/common';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { FilesController } from './file-upload.controller';
import { MinioClient  } from './file-upload.services';


@Module({
  imports: [
    MinioClientModule
  ],
  providers: [MinioClient],
  controllers: [FilesController]
})
export class FileUploadModule {}