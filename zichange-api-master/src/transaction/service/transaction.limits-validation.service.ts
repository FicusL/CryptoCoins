import { BigNumber } from 'bignumber.js';
import { TransactionEUREquivalentRepository } from '../repository/transaction.eur-equivalent.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { TransactionHTTPExceptions } from '../const/transaction.http.exceptions';
import { SettingsFacadeCurrenciesService } from '../../settings/modules/curencies/service/settings.facade.currencies.service';
import { KycRepository } from '../../kyc/repository/kyc.repository';
import { KycTierLevel } from '../../kyc/const/kyc.tier-level.enum';
import { KYCStatusToTierLevel, KYCStatusToTierLevelForCounterpartyTransactions } from '../../kyc/const/kyc.status-to-tier-level';
import { KycEntity } from '../../kyc/entity/kyc.entity';

export class TransactionLimitsValidationService {
  constructor(
    @InjectRepository(TransactionEUREquivalentRepository)
    protected readonly transactionEUREquivalentRepository: TransactionEUREquivalentRepository,

    @InjectRepository(KycRepository)
    protected readonly kycRepository: KycRepository,

    protected readonly settingsFacadeCurrenciesService: SettingsFacadeCurrenciesService,
  ) { }

  protected getTierLevelForCounterpartyTransaction(kyc: KycEntity | undefined): KycTierLevel {
    if (kyc && kyc.status) {
      return KYCStatusToTierLevelForCounterpartyTransactions[kyc.status] || KycTierLevel.Tier1;
    }

    return KycTierLevel.Tier1;
  }

  protected getTierLevel(kyc: KycEntity | undefined): KycTierLevel {
    if (kyc && kyc.status) {
      return KYCStatusToTierLevel[kyc.status] || KycTierLevel.None;
    }

    return KycTierLevel.None;
  }

  async validateDepositAccountLimits(account: AccountEntity, amountEUR: BigNumber, currency: string, isCounterpartyTransaction: boolean) {
    return this.validateAccountLimits(account, amountEUR, currency, isCounterpartyTransaction,
      this.transactionEUREquivalentRepository.getDepositEUREquivalentYTD.bind(this.transactionEUREquivalentRepository));
  }

  async validateWithdrawalAccountLimits(account: AccountEntity, amountEUR: BigNumber, currency: string, isCounterpartyTransaction: boolean) {
    return this.validateAccountLimits(account, amountEUR, currency, isCounterpartyTransaction,
      this.transactionEUREquivalentRepository.getWithdrawalEUREquivalentYTD.bind(this.transactionEUREquivalentRepository));
  }

  async getRestOfDepositLimitInEUR(account: AccountEntity): Promise<BigNumber> {
    const [ currentDepositEUREquivalent, kyc ] = await Promise.all([
      this.transactionEUREquivalentRepository.getDepositEUREquivalentYTD(account),
      this.kycRepository.findByAccount(account),
    ]);

    const accountTierLevel = this.getTierLevel(kyc);
    return AccountEntity.getTierLevelLimitEUR(accountTierLevel).minus(currentDepositEUREquivalent);
  }

  async getRestOfDepositLimitInEURForAccounts(accounts: AccountEntity[]): Promise<IDepositLimit[]> {
    const [ currentDepositEUREquivalents, accountIdToKyc ] = await Promise.all([
      this.transactionEUREquivalentRepository.getDepositEUREquivalentYTDForAccounts(accounts),
      this.kycRepository.findAccountIdToKycMap(accounts),
    ]);

    return currentDepositEUREquivalents.map(item => {
      const kyc = accountIdToKyc.get(item.account.id);
      const accountTierLevel = this.getTierLevel(kyc);

      let limit = AccountEntity.getTierLevelLimitEUR(accountTierLevel).minus(item.equivalent);
      if (limit.isLessThan('0')) {
        limit = new BigNumber('0');
      }

      return { account: item.account, limit };
    });
  }

  protected async validateAccountLimits(
    account: AccountEntity,
    amountEUR: BigNumber,
    currency: string,
    isCounterpartyTransaction: boolean,
    getEUREquivalentYTD: (account: AccountEntity) => Promise<BigNumber>,
  ) {
    const kyc = await this.kycRepository.findByAccount(account);
    const accountTierLevel = isCounterpartyTransaction ? this.getTierLevelForCounterpartyTransaction(kyc) : this.getTierLevel(kyc);

    const accountTierLevelLimitEUR = AccountEntity.getTierLevelLimitEUR(accountTierLevel);

    const [ limit, currentEUREquivalent ] = await Promise.all([
      accountTierLevelLimitEUR,
      getEUREquivalentYTD(account),
    ]);

    const totalEUREquivalent = currentEUREquivalent.plus(amountEUR);

    if (totalEUREquivalent.isGreaterThan(limit)) {
      const remaining = limit.minus(currentEUREquivalent);
      const currencyType = await this.settingsFacadeCurrenciesService.getCurrencyType(currency);
      if (!currencyType) {
        throw new TransactionHTTPExceptions.NotFoundCurrencyType(currency);
      }

      throw new TransactionHTTPExceptions.PaymentLimitExceeded({
        tierLevel: accountTierLevel,
        limit: accountTierLevelLimitEUR,
        remaining,
      });
    }
  }
}

export interface IDepositLimit {
  account: AccountEntity;
  limit: BigNumber;
}