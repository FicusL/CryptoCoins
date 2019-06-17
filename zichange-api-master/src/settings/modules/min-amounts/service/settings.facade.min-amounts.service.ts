import { Injectable } from '@nestjs/common';
import { TransactionPartType } from '../../../../core/const/core.transaction-part-type.enum';
import { SettingsMinAmountsMap } from '../types/settings.min-amounts-map.type';
import { SettingsDepositMinAmountService } from './concrete/settings.deposit-min-amount.service';
import { SettingsExchangeMinAmountService } from './concrete/settings.exchange-min-amount.service';
import { SettingsWithdrawalMinAmountService } from './concrete/settings.withdrawal-min-amount.service';

interface IAllMinAmounts {
  [TransactionPartType.Deposit]: SettingsMinAmountsMap;
  [TransactionPartType.Exchange]: SettingsMinAmountsMap;
  [TransactionPartType.Withdrawal]: SettingsMinAmountsMap;
}

@Injectable()
export class SettingsFacadeMinAmountsService {
  constructor(
    private readonly depositMinAmountsService: SettingsDepositMinAmountService,
    private readonly exchangeMinAmountsService: SettingsExchangeMinAmountService,
    private readonly withdrawalMinAmountsService: SettingsWithdrawalMinAmountService,
  ) {}

  async getAllMinAmounts(): Promise<IAllMinAmounts> {
    const [depositMinAmounts, exchangeMinAmounts, withdrawalMinAmounts] = await Promise.all([
      this.getDepositMinAmounts(),
      this.getExchangeMinAmounts(),
      this.getWithdrawalMinAmounts(),
    ]);

    return {
      [TransactionPartType.Deposit]: depositMinAmounts,
      [TransactionPartType.Exchange]: exchangeMinAmounts,
      [TransactionPartType.Withdrawal]: withdrawalMinAmounts,
    };
  }

  async getDepositMinAmounts(): Promise<SettingsMinAmountsMap> {
    return this.depositMinAmountsService.get();
  }

  async getExchangeMinAmounts(): Promise<SettingsMinAmountsMap> {
    return this.exchangeMinAmountsService.get();
  }

  async getWithdrawalMinAmounts(): Promise<SettingsMinAmountsMap> {
    return this.withdrawalMinAmountsService.get();
  }
}