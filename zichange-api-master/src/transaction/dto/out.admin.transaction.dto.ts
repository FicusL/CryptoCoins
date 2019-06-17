import { TransactionEntity } from '../entity/transaction.entity';
import { OutTransactionDTO } from './transaction/out.transaction.dto';

export class OutAdminTransactionDto extends OutTransactionDTO {
  constructor(transaction: TransactionEntity) {
    super(transaction);
  }
}