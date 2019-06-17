import {TransactionWithdrawalMethodType} from '../../../const/transaction.withdrawal-method.enum';
import {Column, ColumnOptions, ManyToOne} from 'typeorm';
import {CryptoWalletEntity} from '../../../../requisite/entity/crypto.wallet.entity';
import {BankAccountEntity} from '../../../../requisite/entity/bank.account.entity';
import {ITransactionWithdrawalMethodEmbedded} from '../../../abstract/operations/transaction-parts/transaction.withdrawal.method.embedded.interface';
import {ITransactionWithdrawalMethod} from '../../../abstract/transaction.withdrawal-method.interface';

export class TransactionWithdrawalMethodEmbedded implements ITransactionWithdrawalMethodEmbedded {
  @Column({ enum: TransactionWithdrawalMethodType, nullable: true })
  type: TransactionWithdrawalMethodType;

  @ManyToOne(type => CryptoWalletEntity, { nullable: true })
  cryptoWallet?: CryptoWalletEntity;

  @ManyToOne(type => BankAccountEntity, { nullable: true })
  bankAccount?: BankAccountEntity;

  @Column({ type: 'jsonb', nullable: true } as ColumnOptions)
  method?: ITransactionWithdrawalMethod;

  constructor(data?: Partial<TransactionWithdrawalMethodEmbedded>) {
    if (!data) {
      return;
    }

    Object.assign(this, data);
  }
}