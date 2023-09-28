export class UploadProductViaFileDto {
  file: Express.Multer.File;
  constructor(file: Express.Multer.File) {
    this.file = file;
  }
}
