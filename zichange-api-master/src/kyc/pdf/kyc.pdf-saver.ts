import * as PdfMakePrinter from 'pdfmake/src/printer';
import * as fs from 'fs';
import * as SevenBin from '7zip-bin';
import * as Seven from 'node-7z';
import { IKycPdfCreator } from './kyc.pdf-creator.interface';
import { v4 as uuid } from 'uuid/v4';
import { readFileAsync } from '../../core/util/read-file-async';
import { removeFileAsync } from '../../core/util/remove-file-async';

// NOTE:
// I used to use 'minizip-asm.js'. But it did not work with '@google-cloud/storage'
// Therefore, a 'node-7z' is used here. Not the best way. It need to fix later.

export class KycPdfSaver {
  // region Public methods

  pdfToBuffer(pdfCreator: IKycPdfCreator): Promise<Buffer> {
    return new Promise((resolve) => {
      const result: any[] = [];
      const pdfDoc = this.createPdfDocument(pdfCreator);

      pdfDoc
        .on('data', chunk => result.push(chunk))
        .on('end', () => resolve(Buffer.concat(result)));
      pdfDoc.end();
    });
  }

  pdfToFile(pdfCreator: IKycPdfCreator, fileName: string): Promise<void> {
    return new Promise((resolve) => {
      const pdfDoc = this.createPdfDocument(pdfCreator);

      pdfDoc
        .pipe(fs.createWriteStream(fileName))
        .on('finish', () => resolve());
      pdfDoc.end();
    });
  }

  async archiveWithPdfToBuffer(data: IArchiveWithPdfToBuffer): Promise<Buffer> {
    const archiveFileName = `${uuid()}.7z`;
    await this.archiveWithPdfToFile({ ...data, archiveFileName });

    const buffer = await readFileAsync(archiveFileName);
    await removeFileAsync(archiveFileName);

    return buffer;
  }

  async archiveWithPdfToFile(data: IArchiveWithPdfToFile): Promise<void> {
    await this.pdfToFile(data.pdfCreator, data.kycFileName);

    await this.addFilesToArchive(data.archiveFileName, [ data.kycFileName ], {
      deleteFilesAfter: true,
      password: data.password,
    });
  }

  // endregion

  // region Private methods

  private addFilesToArchive(archiveFileName: string, files: string[], options: ISevenOptions): Promise<void> {
    return new Promise(resolve => {
      const myStream = Seven.add(archiveFileName, files, {
        $bin: SevenBin.path7za,
        ...options,
      });

      myStream.on('end', () => resolve());
    });
  }

  private createPdfDocument(pdfCreator: IKycPdfCreator) {
    const printer = new PdfMakePrinter({
      Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Bold.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
      },
    });

    const docDefinition = pdfCreator.getDocDefinition();
    return printer.createPdfKitDocument(docDefinition);
  }

  // endregion
}

// region Types

interface IArchiveWithPdfToBuffer {
  pdfCreator: IKycPdfCreator;
  password: string;
  kycFileName: string;
}

interface IArchiveWithPdfToFile {
  pdfCreator: IKycPdfCreator;
  archiveFileName: string;
  kycFileName: string;
  password: string;
}

interface ISevenOptions {
  deleteFilesAfter?: boolean;
  password: string;
}

// endregion