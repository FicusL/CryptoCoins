import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigsService } from '../../../service/configs.service';

@Injectable()
export class NotificationTelegramService {
  private static LogContext = 'NotificationTelegramService';

  constructor(
    private readonly httpService: HttpService,
  ) { }

  async sendMessageToChatId(message: string, chatId: string) {
    const botToken = ConfigsService.telegramBotToken;
    if  (!botToken) {
      return;
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage?text=${message}&chat_id=${chatId}`;

    try {
      const response = await this.httpService.get(url).toPromise();
      if (response.status !== 200) {
        Logger.error(response.data, undefined, NotificationTelegramService.LogContext);
      }
    } catch (e) {
      Logger.error(e.message, undefined, NotificationTelegramService.LogContext);
    }
  }

  async sendMessage(message: string) {
    const chatId = ConfigsService.telegramChatId;
    await this.sendMessageToChatId(message, chatId);
  }
}