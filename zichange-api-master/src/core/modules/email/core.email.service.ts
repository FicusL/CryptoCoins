import * as marko from 'marko';
import * as path from 'path';
import * as mailgunjs from 'mailgun-js';
// @ts-ignore
import * as MailComposer from 'nodemailer/lib/mail-composer';
import {Injectable, InternalServerErrorException, Logger, OnApplicationBootstrap} from '@nestjs/common';
import { Mailgun } from 'mailgun-js';
import { Address, Attachment } from 'nodemailer/lib/mailer';
import { ConfigsService } from '../../service/configs.service';

interface Options {
  /** The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com' or formatted 'Sender Name <sender@server.com>' */
  from?: string | Address;
  /** An e-mail address that will appear on the Sender: field */
  sender?: string | Address;
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the To: field */
  to?: string | Address | Array<string | Address>;
  /** The subject of the e-mail */
  subject?: string;
  /** An array of attachment objects */
  attachments?: Attachment[];
}

@Injectable()
export class CoreEmailService implements OnApplicationBootstrap {
  protected mailgun: Mailgun;

  // noinspection JSMethodCanBeStatic
  public async send<DataType>(options: Options, templateName: string = 'default', templateData: DataType | {} = {}): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dirPath = path.resolve(`email-templates/`);
      const template = marko.load(`${dirPath}/${templateName}.marko`);

      const from = options.from || ConfigsService.mailGunDefaultFrom;
      const sender = options.sender || ConfigsService.mailGunDefaultSender;
      const subject = options.subject;

      const to = options.to;
      if (!to) {
        reject(new InternalServerErrorException('No email `to` option provided'));
        return;
      }

      const html = template.renderToString(templateData);
      const attachments = options.attachments;

      const preparedOptions = { from, sender, to, subject, html, attachments };
      const emailComposer = new MailComposer(preparedOptions);

      emailComposer.compile().build((emailCompileError, message) => {
        if (emailCompileError) {
          reject(new InternalServerErrorException('Failed email message compilation', emailCompileError.message));
          return;
        }

        const dataToSend = {
          to: preparedOptions.to,
          message: message.toString('utf8'),
        };

        // @ts-ignore // Ignore due to incorrect typings
        this.mailgun.messages().sendMime(dataToSend, (sendError, body) => {
          if (sendError) {
            reject(new InternalServerErrorException('Failed email sending', sendError.message));
            return;
          }

          if (ConfigsService.mailGunTestMode) {
            Logger.log(body);
          }

          resolve();
        });
      });
    });
  }

  public async sendPlainText(options: Options, lines: string[]): Promise<boolean> {
    return await this.send(options, 'plain-text', { lines });
  }

  onApplicationBootstrap() {
    this.mailgun = mailgunjs({
      apiKey: ConfigsService.mailGunApiKey,
      domain: ConfigsService.mailGunDomain,
      testMode: ConfigsService.mailGunTestMode,
    } as any);
  }
}
