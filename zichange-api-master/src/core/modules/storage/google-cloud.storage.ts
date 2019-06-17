import { Injectable, Logger } from '@nestjs/common';
import { ConfigsService } from '../../service/configs.service';
import { Bucket, Storage } from '@google-cloud/storage';

interface IUploadFileOptions {
  localPath: string;
  storagePath: string;
}

@Injectable()
export class GoogleCloudStorage {
  private readonly storage: Storage;
  private readonly bucket: Bucket;

  constructor() {
    this.storage = new Storage({
      projectId: ConfigsService.googleCloudStorageBucket,
      keyFilename: ConfigsService.googleCloudKeyFile,
    });

    this.bucket = this.storage.bucket(ConfigsService.googleCloudStorageBucket);
  }

  async downloadFile(storagePath: string): Promise<Buffer> {
    const file = this.bucket.file(storagePath);

    const downloadResponse = await file.download();
    return Buffer.concat(downloadResponse);
  }

  async uploadBuffer(data: Buffer, storagePath: string) {
    const file = this.bucket.file(storagePath);

    await file.save(data, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
      },
    });

    Logger.log(`uploaded to ${ConfigsService.googleCloudStorageBucket}. File ${storagePath}`, GoogleCloudStorage.name);
  }

  async uploadFile(options: IUploadFileOptions) {
    await this.bucket.upload(options.localPath, {
      destination: options.storagePath,
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
      },
    });

    Logger.log(`uploaded to ${ConfigsService.googleCloudStorageBucket}. File ${options.storagePath}`, GoogleCloudStorage.name);
  }
}