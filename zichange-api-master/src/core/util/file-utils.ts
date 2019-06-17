import { IFileElement } from '../abstract/file.element.interface';
import { convertPdfBufferToPng } from './pdf-to-png';

export class FileUtils {
  static fileIsPdf(file: IFileElement): boolean {
    return file.mimetype === 'application/pdf';
  }

  static getFileExtensionForMimetype(mimetype: string): string {
    return mimetype.split('/')[1];
  }

  static getFileExtension(file: IFileElement): string {
    return this.getFileExtensionForMimetype(file.mimetype);
  }

  static getFileType(file: IFileElement): string {
    return file.mimetype.split('/')[0];
  }

  static getFileSize(file: IFileElement): number {
    return file.buffer.length;
  }

  static async convertPdfFileToPng(file: IFileElement): Promise<IFileElement> {
    if (this.fileIsPdf(file)) {
      return {
        buffer: await convertPdfBufferToPng(file.buffer),
        mimetype: 'image/png',
        fieldname: file.fieldname,
        originalname: file.originalname,
      };
    }

    return file;
  }
}