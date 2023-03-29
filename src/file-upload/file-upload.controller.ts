import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Readable } from 'stream';
import { MinioClient } from './file-upload.services';
import { createReadStream } from 'fs';
const fs = require('fs');
import { PDFDocument } from 'pdf-lib';
import * as Minio from 'minio';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
var pdf2img = require('pdf-img-convert');

// @Controller('files')
// export class FilesController {
//   constructor(private readonly minioClient: MinioClient) {}

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadFile(@UploadedFile() file, id: number): Promise<void> {
//     await this.minioClient.uploadFile(
//       'test',
//       id,
//       file.originalname,
//       file.buffer,
//     );
//     id++;
//   }

//   @Get('text')
//   func() {
//     return this.minioClient.extractTextFromPdf();
//   }

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  destination?: string;
  filename?: string;
  path?: string;
}
@Controller('files')
export class FilesController {
  constructor(private readonly minioclient: MinioClient) {}

  // @Get(':bucket')
  // async getFile(
  //   @Param('bucket') bucket: string,
  //   // @Body() object:any,
  //   @Res() res: Response,
  // ) {
  //   const stream = await this.minioclient.getFile(
  //     bucket,
  //     '4/Rich Dad Poor Dad ( PDFDrive ) (1).pdf',
  //   );
  //   console.log(stream.pipe(res));
  // }

  @Post('/pdf2image')
  @UseInterceptors(FileInterceptor('file'))
  async convertPdfToImage(@UploadedFile() file) {
    this.minioclient.convertoImage(file);
    return 'success';
  }

  @Post('/:bucketName/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('bucketName') bucketName: string,
    @Param('id') id: string,
    @UploadedFile() file: UploadedFile,
  ) {
    this.minioclient.storeFile(bucketName, id, file.buffer, file);
  }
}
