import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AccountEntity } from '../entitiy/account.entity';
import { BigNumber } from 'bignumber.js';
import { AccountRepository } from '../repository/account.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsReferralService } from '../../settings/modules/referral/service/settings.referral.service';
import { AccountExceptions } from '../const/account.exceptions';

@Injectable()
export class AccountReferralService {
  constructor(
    @InjectRepository(AccountRepository)
    private readonly accountRepository: AccountRepository,

    private readonly settingsReferralService: SettingsReferralService,
  ) { }

  async getReferrals(accountId: number) {
    return await this.accountRepository.getReferrals(accountId);
  }

  async getAccountByReferralToken(referralToken: string): Promise<AccountEntity> {
    const account = await this.accountRepository.findByReferralToken(referralToken);
    if (!account) {
      throw new AccountExceptions.IncorrectReferralToken();
    }

    return account;
  }

  async enablePartnerProgram(account: AccountEntity) {
    if (account.isPartner) {
      throw new AccountExceptions.AccountAlreadyPartner();
    }

    account.isPartner = true;
    account.referralToken = account.generateReferralToken();

    const referralOptions = await this.settingsReferralService.get();
    account.exchangeCommissionCoefficient = referralOptions.exchangeCommissionCoefficient;

    await this.saveAccount(account);
  }

  async disablePartnerProgram(account: AccountEntity) {
    await this.accountRepository.disablePartnerProgram(account);
    await this.accountRepository.releaseReferrals(account);
  }

  async setExchangeCommissionCoefficient(account: AccountEntity, exchangeCommissionCoefficient: BigNumber) {
    if (!account.isPartner) {
      throw new AccountExceptions.AccountMustBePartner();
    }

    account.exchangeCommissionCoefficient = exchangeCommissionCoefficient;

    await this.saveAccount(account);
  }

  async becomeReferral(params: { referral: AccountEntity, refer: AccountEntity }) {
    const { refer, referral } = params;

    if (refer.id === referral.id) {
      throw new AccountExceptions.PartnerCannotBeHisOwnReferral();
    }

    if (!refer.isPartner) {
      throw new AccountExceptions.AccountMustBePartner();
    }

    if (referral.referId) {
      throw new AccountExceptions.AccountAlreadyReferral();
    }

    referral.refer = refer;
    await this.saveAccount(referral);
  }

  protected async saveAccount(account: AccountEntity) {
    try {
      return await this.accountRepository.save(account);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}