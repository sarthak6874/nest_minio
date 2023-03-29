import { Injectable } from '@nestjs/common';
import { Client } from '@nestjs/microservices';
import * as Minio from 'minio';
import { constant } from 'helper';
import { Stream } from 'stream';
var streamToBuffer = require('stream-to-buffer');
var pdf2img = require('pdf-img-convert');
const pdfjsLib = require('pdfjs-dist');
const fs = require('fs');
const PDFParser = require('pdf-parse');
const { PDFDocument } = require('pdf-lib');

@Injectable()
export class MinioClient {
  readonly client: Minio.Client;

  constructor() {
    this.client = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
    });
  }

  extractTextFromPdf() {
    const pdfData = fs.readFileSync('ocr.pdf');

    PDFParser(pdfData).then(function (data) {
      console.log(data.text);
    });
  }
  myConstant = new constant();
  async convertoImage(file) {
    const fileBuffer = await this.client.getObject('test', `${1}/files/${file.originalname}`);
    const outputImages = await pdf2img.convert(
      '/home/billion/Downloads/Rich Dad Poor Dad ( PDFDrive ) (1).pdf',
    );
    fs.mkdirSync(this.myConstant.temprory);
    //console.log(outputImages.length)
    for (let i = 0; i < outputImages.length; i++) {
      var fileName: string = 'page' + i + '.png';
      fs.writeFile(
        'temp/output' + i  + this.myConstant.extension , 
        outputImages[i],
        function (error, output) {
          if (error) {
            console.error('Error: ' + error);
          }
        },
      );
      const stream:Stream = fs.createReadStream(
        'temp/output' + i + '.png',
        outputImages[i],
      );
      await this.client.putObject('test', `1/pages/${i}/${fileName}`, stream);
      //await this.client.convertoImage('test', fileName, buffer);
    }
    const folderPath: string = this.myConstant.temprory;
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file) => {
        const curPath = `${folderPath}/${file}`;

        fs.unlinkSync(curPath);
      });
      fs.rmdirSync(folderPath);
    }
  }

  // async getFile(bucketName: string, objectName: string) {
  //   const stream = await this.client.getObject(bucketName, objectName);

  //   return stream;
  // }

  async storeFile(bucketName: string, id: string, fileBuffer: Buffer, file) {
    const userId: number = parseInt(id);
    console.log(userId);

    const fileName: string = `${userId}/files/${file.originalname}`;
    console.log(fileName);

    await this.client.putObject(bucketName, fileName, fileBuffer);
  }
}
