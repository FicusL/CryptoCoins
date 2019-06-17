import { TransactionEntity } from '../entity/transaction.entity';
import { OutTransactionDTO } from './transaction/out.transaction.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { AccountEntity } from '../../account/entitiy/account.entity';

export class OutAdminExtendedTransactionDTO extends OutTransactionDTO {
  @ApiModelProperty()
  email: string;

  constructor(transaction: TransactionEntity, account: AccountEntity) {
    super(transaction);

    this.email = account.email;
  }
}