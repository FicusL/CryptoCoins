import {ApiModelProperty} from '@nestjs/swagger';
import {TransactionWithdrawalMethodType} from '../../../const/transaction.withdrawal-method.enum';
import {ITransactionWithdrawalMethodEmbedded} from '../../../abstract/operations/transaction-parts/transaction.withdrawal.method.embedded.interface';
import {OutCryptoWalletDTO} from '../../../../requisite/dto/out.crypto.wallet.dto';
import {OutBankAccountDTO} from '../../../../requisite/dto/out.bank.account.dto';

export class OutTransactionWithdrawalMethodDTO {
  @ApiModelProperty({ enum: TransactionWithdrawalMethodType })
  type: TransactionWithdrawalMethodType;

  @ApiModelProperty()
  data: OutCryptoWalletDTO | OutBankAccountDTO;

  constructor(data: ITransactionWithdrawalMethodEmbedded) {
    this.type = data.type;

    this.data = {} as any;

    if (data.type === TransactionWithdrawalMethodType.CryptoWallet) {

      if (data.cryptoWallet) {
        this.data = new OutCryptoWalletDTO(data.cryptoWallet);
      } else if (data.method && data.method.type === TransactionWithdrawalMethodType.CryptoWallet) {
        this.data = new OutCryptoWalletDTO(data.method.data);
      }

    } else if (data.type === TransactionWithdrawalMethodType.BankAccount) {

      if (data.bankAccount) {
        this.data = new OutBankAccountDTO(data.bankAccount);
      } else if (data.method && data.method.type === TransactionWithdrawalMethodType.BankAccount) {
        this.data = new OutBankAccountDTO(data.method.data);
      }

    }
  }
}