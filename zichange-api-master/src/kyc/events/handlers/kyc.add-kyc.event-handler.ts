import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { KycAddKycEvent } from '../impl/kyc.add-kyc.event';
import { NotificationTelegramService } from '../../../core/modules/notification/service/notification.telegram.service';
import { Logger } from '@nestjs/common';
import { CoreEmailService } from '../../../core/modules/email/core.email.service';
import { ConfigsService } from '../../../core/service/configs.service';

@EventsHandler(KycAddKycEvent)
export class KycAddKycEventHandler implements IEventHandler<KycAddKycEvent> {
  constructor(
    private readonly notificationTelegramService: NotificationTelegramService,
    protected readonly emailService: CoreEmailService,
  ) { }

  private async sendEmailToZichange(buffer: Buffer) {
    try {
      await this.emailService.send({
        to: ConfigsService.emailForNotifyAboutKyc,
        subject: 'ZiChange KYC',
        attachments: [
          {
            filename: 'kyc.7z',
            content: buffer,
          },
        ],
      });
    } catch (e) {
      Logger.error(e.message, undefined, KycAddKycEventHandler.name);
    }
  }

  private async sendMessage() {
    try {
      await this.notificationTelegramService.sendMessage('New KYC sent to compliance@zichange.io');
    } catch (e) {
      Logger.error(e.message, undefined, KycAddKycEventHandler.name);
    }
  }

  async handle(event: KycAddKycEvent) {
    await this.sendMessage();
    await this.sendEmailToZichange(event.buffer);
  }
}