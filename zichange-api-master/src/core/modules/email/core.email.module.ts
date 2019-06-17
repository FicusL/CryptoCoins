import { Module } from '@nestjs/common';
import { CoreEmailService } from './core.email.service';

@Module({
  providers: [
    CoreEmailService,
  ],
  
  exports: [
    CoreEmailService,
  ],
})
export class CoreEmailModule {}