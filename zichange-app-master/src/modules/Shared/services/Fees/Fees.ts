import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../AxiosWrapper';
import { InTransactionGetFeeDTO, TransactionPartType } from './dto/InTransactionGetFeeDTO';
import { TransactionDepositMethodType } from '../../modules/Transactions/const/TransactionDepositMethodType';
import { TransactionWithdrawalMethodType } from '../../modules/Transactions/const/TransactionWithdrawalMethodType';


@injectable()
export class Fees {
  @inject(AxiosWrapper)
  api: AxiosWrapper;

  async getExchangeFee(currency: string, amount: string) {
    const { amount: feeAmount } = await this.api.post<InTransactionGetFeeDTO>('/transactions/fee', {
      type: TransactionPartType.Exchange,
      amount,
      currency,
    });

    return feeAmount;
  }

  async getDepositFee(currency: string, amount: string, depositMethod: TransactionDepositMethodType) {
    const { amount: feeAmount } = await this.api.post<InTransactionGetFeeDTO>('/transactions/fee', {
      type: TransactionPartType.Deposit,
      amount,
      currency,
      depositMethod,
    });

    return feeAmount;
  }

  async getWithdrawFee(currency: string, amount: string, withdrawalMethod: TransactionWithdrawalMethodType) {
    const { amount: feeAmount } = await this.api.post<InTransactionGetFeeDTO>('/transactions/fee', {
      type: TransactionPartType.Withdrawal,
      amount,
      currency,
      withdrawalMethod,
    });

    return feeAmount;
  }

}