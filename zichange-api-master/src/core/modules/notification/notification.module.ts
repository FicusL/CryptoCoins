import { HttpModule, Module } from '@nestjs/common';
import { NotificationTelegramService } from './service/notification.telegram.service';

@Module({
  imports: [ HttpModule ],
  providers: [ NotificationTelegramService ],
  exports: [ NotificationTelegramService ],
})
export class NotificationModule { }
