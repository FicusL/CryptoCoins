import { InternalServerErrorException } from '@nestjs/common';
import { AccountEntity } from '../entitiy/account.entity';
import { AccountRepository } from '../repository/account.repository';
import { InjectRepository } from '@nestjs/typeorm';
import * as speakeasy from 'speakeasy';
import { AccountExceptions } from '../const/account.exceptions';
import { ConfigsService } from '../../core/service/configs.service';

export class Account2FAService {
  constructor(
    @InjectRepository(AccountRepository)
    private readonly accountRepository: AccountRepository,
  ) { }

  async generate2FA(account: AccountEntity): Promise<Object> {
    if (account.twoFaEnabled) {
      throw new AccountExceptions.AlreadyEnabled2FA();
    }

    const secret = speakeasy.generateSecret({ name: 'Zichain', length: 10 });
    account.twoFaSecret = secret.base32;

    try {
      await this.accountRepository.save(account);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return secret;
  }

  async enable2FA(account: AccountEntity, password: string, code: string) {
    if (!account.isPasswordValid(password)) {
      throw new AccountExceptions.IncorrectPassword();
    }

    if (account.twoFaEnabled) {
      throw new AccountExceptions.AlreadyEnabled2FA();
    }

    if (!account.twoFaSecret) {
      throw new AccountExceptions.NotGenerated2FACode();
    }

    const isVerificationPassed = speakeasy.totp.verify({
      secret: account.twoFaSecret,
      encoding: 'base32',
      token: code,
    });

    if (!isVerificationPassed) {
      throw new AccountExceptions.Incorrect2FACode();
    }

    account.twoFaEnabled = true;

    try {
      account = await this.accountRepository.save(account);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return account;
  }

  async disable2FA(account: AccountEntity, password: string, code: string) {
    if (!account.twoFaEnabled) {
      throw new AccountExceptions.AlreadyDisabled2FA();
    }

    if (!account.isPasswordValid(password)) {
      throw new AccountExceptions.IncorrectPassword();
    }

    const isVerificationPassed = speakeasy.totp.verify({
      secret: account.twoFaSecret,
      encoding: 'base32',
      token: code,
    });

    if (!isVerificationPassed) {
      throw new AccountExceptions.Incorrect2FACode();
    }

    account.twoFaSecret = undefined;
    account.twoFaEnabled = false;

    try {
      account = await this.accountRepository.save(account);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return account;
  }

  async is2FAValid(account: AccountEntity, code?: string): Promise<boolean> {
    if (!ConfigsService.isProduction) {
      return true;
    }

    if (!account.twoFaEnabled) {
      return true;
    }

    return speakeasy.totp.verify({
      secret: account.twoFaSecret,
      encoding: 'base32',
      token: code,
    });
  }

  async verify2FA(account: AccountEntity, code?: string) {
    const is2FAPassed = await this.is2FAValid(account, code);
    if (!is2FAPassed) {
      throw new AccountExceptions.Incorrect2FACode();
    }
  }
}