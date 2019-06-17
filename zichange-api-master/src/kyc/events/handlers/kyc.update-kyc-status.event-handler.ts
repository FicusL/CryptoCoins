import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CoreEmailService } from '../../../core/modules/email/core.email.service';
import { KycUpdateKycStatusEvent } from '../impl/kyc.update-kyc-status.event';
import { ConfigsService } from '../../../core/service/configs.service';

@EventsHandler(KycUpdateKycStatusEvent)
export class KycUpdateKycStatusEventHandler implements IEventHandler<KycUpdateKycStatusEvent> {
  constructor(
    protected readonly emailService: CoreEmailService,
  ) { }

  private async sendPlainTextToZichange(event: KycUpdateKycStatusEvent) {
    const dateArray = new Date().toISOString().split('T');
    const datePart = dateArray[0].split('-');
    const timePart = dateArray[1].split(':');

    const date = `${datePart[2]}.${datePart[1]}.${datePart[0]} ${timePart[0]}:${timePart[1]}`;

    try {
      await this.emailService.sendPlainText({
        to: ConfigsService.emailForNotifyAboutNewInformation,
        subject: 'ZiChange KYC',
      }, [
        'You have an update in KYC.',
        '',
        `Date: ${date}`,
        `ID: ${event.kyc.id}`,
        `Client: ${event.account.email}`,
        `Type: ${event.account.type}`,
        `Status: ${event.kyc.status}`,
      ]);
    } catch (e) {
      Logger.error(e.message, undefined, KycUpdateKycStatusEventHandler.name);
    }
  }

  async handle(event: KycUpdateKycStatusEvent) {
    await this.sendPlainTextToZichange(event);
  }
}