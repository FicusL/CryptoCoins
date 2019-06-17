import { GoogleCloudStorage } from '../../core/modules/storage/google-cloud.storage';
import { KycEntity } from '../entity/kyc.entity';
import { KycExceptions } from '../const/kyc.exceptions';
import { ConfigsService } from '../../core/service/configs.service';
import * as path from 'path';
import { readFileAsync } from '../../core/util/read-file-async';
import { IKycPdfCreator } from '../pdf/kyc.pdf-creator.interface';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { KycPdfSaver } from '../pdf/kyc.pdf-saver';
import { writeFileAsync } from '../../core/util/write-file-async';
import { KycService } from './kyc.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KycPdfHelperService {
  constructor(
    protected readonly googleCloudStorage: GoogleCloudStorage,
  ) { }

  async getKycArchiveWithPdfAsBuffer(kyc: KycEntity): Promise<Buffer> {
    if (!kyc.fileName) {
      throw new KycExceptions.KYCFileNotExists();
    }

    const archiveFileName = KycService.generateArchiveFileName(kyc.fileName);

    // loading PDF
    if (ConfigsService.useGoogleCloudStorage) {
      const storageFileName = `${ConfigsService.googleCloudDirectory}/${archiveFileName}`;

      return await this.googleCloudStorage.downloadFile(storageFileName);
    } else {
      const fullFileName = `${path.resolve(ConfigsService.kycDirectoryPath)}/${archiveFileName}`;

      return await readFileAsync(fullFileName);
    }
  }

  async createPDF(pdfCreator: IKycPdfCreator, account: AccountEntity): Promise<{ buffer: Buffer, fileName: string }> {
    const pdfSaver = new KycPdfSaver();
    const fileName = `${account.email}#${Date.now()}`;

    const kycFileName = `${fileName}.pdf`;
    const archiveFileName = KycService.generateArchiveFileName(fileName);

    // PDF generating
    const buffer = await pdfSaver.archiveWithPdfToBuffer({
      pdfCreator,
      password: ConfigsService.kycSecretPassword,
      kycFileName,
    });

    // saving PDF
    if (ConfigsService.useGoogleCloudStorage) {
      const storageFileName = `${ConfigsService.googleCloudDirectory}/${archiveFileName}`;

      await this.googleCloudStorage.uploadBuffer(buffer, storageFileName);
    } else {
      const fullFileName = `${path.resolve(ConfigsService.kycDirectoryPath)}/${archiveFileName}`;

      await writeFileAsync(fullFileName, buffer);
    }

    return { buffer, fileName };
  }
}