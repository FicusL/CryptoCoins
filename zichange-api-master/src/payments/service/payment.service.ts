import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import {TransactionService} from '../../transaction/service/transaction.service';
import {InjectRepository} from '@nestjs/typeorm';
import {TransactionRepository} from '../../transaction/repository/transaction.repository';
import {TransactionEntity} from '../../transaction/entity/transaction.entity';
import {TransactionStatus} from '../../transaction/const/transaction.status.enum';
import { TransactionChangeTransactionEvent } from '../../transaction/events/impl/transaction.change-transaction.event';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class PaymentService {
  constructor(
    private readonly eventBus: EventBus,
    private readonly transactionService: TransactionService,

    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) { }

  async approvePayment(transaction: TransactionEntity) {
    const context = `${PaymentService.name}: ${Date.now()}`;

    const oldTransaction = new TransactionEntity(transaction);

    transaction.status = TransactionStatus.Completed;
    transaction.deposit.paid = true;
    Logger.log({transaction}, context);

    try {
      transaction = await this.transactionRepository.correctSave(transaction);

      this.eventBus.publish(new TransactionChangeTransactionEvent({
        oldTransaction,
        newTransaction: transaction,
      }));
    } catch (e) {
      Logger.log({exception: e}, context);
      throw new InternalServerErrorException();
    }
  }
}