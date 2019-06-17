import { Module } from '@nestjs/common';
import { CoreModule } from '../../core.module';
import { GoogleCloudStorage } from './google-cloud.storage';

@Module({
  imports: [
    CoreModule,
  ],
  providers: [
    GoogleCloudStorage,
  ],
  exports: [
    GoogleCloudStorage,
  ],
})
export class StorageModule { }