import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AccountEntity } from '../entitiy/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from '../repository/account.repository';
import { AccountChangeEmailRequestEntity } from '../entitiy/account.change-email.request.entity';
import { AccountChangeEmailRequestRepository } from '../repository/account.change-email-request.repository';
import { ConfigsService } from '../../core/service/configs.service';
import { AccountService } from './account.service';
import { CoreEmailService } from '../../core/modules/email/core.email.service';
import { AccountExceptions } from '../const/account.exceptions';

@Injectable()
export class AccountChangeEmailService {
  constructor(
    @InjectRepository(AccountRepository)
    private readonly accountRepository: AccountRepository,

    @InjectRepository(AccountChangeEmailRequestRepository)
    private readonly accountChangeEmailRequestRepository: AccountChangeEmailRequestRepository,

    private readonly accountService: AccountService,
    protected readonly emailService: CoreEmailService,
  ) { }

  // region Public methods

  async changeEmail(account: AccountEntity, newEmail: string) {
    const found = await this.accountRepository.findByEmail(newEmail);
    if (found) {
      throw new AccountExceptions.EmailAlreadyRegistered();
    }

    let requestEntity = new AccountChangeEmailRequestEntity();

    requestEntity.account = account;
    requestEntity.activationToken = AccountChangeEmailRequestEntity.generateToken(account);
    requestEntity.isActive = true;
    requestEntity.newEmail = newEmail;

    requestEntity = await this.accountChangeEmailRequestRepository.save(requestEntity);

    await this.sendEmail(requestEntity);
  }

  async activateNewEmail(token: string) {
    let requestEntity = await this.accountChangeEmailRequestRepository.findByToken(token);
    if (!requestEntity) {
      throw new AccountExceptions.ActivationTokenIncorrect();
    }

    if (!requestEntity.isActive) {
      throw new AccountExceptions.ActivationTokenIncorrect();
    }

    requestEntity.isActive = false;
    requestEntity = await this.accountChangeEmailRequestRepository.save(requestEntity);

    let account = await this.accountService.getAccountById(requestEntity.accountId);
    account.email = requestEntity.newEmail;

    try {
      account = await this.accountRepository.save(account);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  // endregion

  // region Private methods

  async sendEmail(requestEntity: AccountChangeEmailRequestEntity) {
    try {
      await this.emailService.send({
        subject: 'ZiChange account change email',
        to: requestEntity.newEmail,
      }, 'change-email', {
        link: `${ConfigsService.domainFrontEnd}/accounts/change_email/${requestEntity.activationToken}`,
      });
    } catch (e) {
      Logger.error(e.message, undefined, `${AccountChangeEmailService.name}.${this.sendEmail.name}`);
      throw new InternalServerErrorException();
    }
  }

  // endregion
}