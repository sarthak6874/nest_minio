import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
//import { PDFDocument, PDFParser } from 'pdf-lib';
// import { getTextFromPdf, PDFParse } from 'pdf-parse';
// import { Readable } from 'stream';
// import { createReadStream, ReadStream } from 'fs';
// import { ReadableStream } from 'node:stream/web';
// import * as tesseract from 'node-tesseract-ocr';
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

  async uploadFile(
    bucketName: string,
    fileName: string,
    fileData: Buffer,
  ): Promise<void> {
    await this.client.putObject(bucketName, fileName, fileData);
  }

  //   extractTextFromPdf(){
  // const pdfData = fs.readFileSync('/home/billion/Downloads/Rich Dad Poor Dad ( PDFDrive ) (1).pdf_page126 (1).pdf');

  // PDFParser(pdfData).then(function(data) {
  //   console.log(data.text);
  // });

  async fetchWordDetails() {
    const pdfData = fs.readFileSync('ocr.pdf');

    const pdfDoc = await PDFDocument.load(pdfData);
    const pages = [pdfDoc.getPages()];
    const words = [];
    PDFParser(pdfData).then(function(data) {
      const content=data.text;
      console.log(content)
      
      const pageWords=[];
        const items = content;
        console.log(items)
        for (let j = 0; j < items.length; j++) {
          // const word='i';
          // const matrix = items[j].transformMatrix;
          // const x = matrix[1];
          // const y = matrix[2];
          // const width = matrix[0];
          // const height = matrix[3];
          // pageWords.push({ word, x, y, width, height });
          
          const item = items[j];
          const word = item.str;
          console.log(item.transform)
          const { x, y, width, height } = item.transform;
          words.push({ page: 1, word, x, y, width, height });
        }
    
      console.log(words);
    })
    
    

   
    
    
  }
      

  
  
}
