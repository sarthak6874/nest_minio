import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioClient } from './file-upload.services';
import { createReadStream } from 'fs';
import { PDFDocument } from 'pdf-lib';
import * as Minio from 'minio';

@Controller('files')
export class FilesController {
  constructor(private readonly minioClient: MinioClient) {}

  

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file): Promise<void> {
      await this.minioClient.uploadFile('test', file.originalname, file.buffer);
    }

  @Get('text')
  func(){
    return this.minioClient.fetchWordDetails()
  }

  @Post('split')
  @UseInterceptors(FileInterceptor('file'))
  async splitPdf(@UploadedFile() file): Promise<void> {
    // Load the PDF file
    const pdfDoc = await PDFDocument.load(file.buffer);

    // Split the PDF file into pages
    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      // Create a new PDF document with a single page
      const newDoc = await PDFDocument.create();
      const [newPage] = await newDoc.copyPages(pdfDoc, [i]);
      newDoc.addPage(newPage);

      // Save the page to a buffer
      const newDocBytes = await newDoc.save();
      const buffer = Buffer.from(newDocBytes);
      // Upload the buffer to MinIO
      const fileName = `${file.originalname}_page${i + 1}.pdf`;

      await this.minioClient.client.putObject(
        'test',
        fileName,
        buffer,
        newDocBytes.length,
      );
    }
  }
}
