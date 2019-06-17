import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AccountService } from '../account/service/account.service';
import { TransactionService } from '../transaction/service/transaction.service';
import { EventBus } from '@nestjs/cqrs';
import { TransactionAddTransactionEvent } from '../transaction/events/impl/transaction.add-transaction.event';
import { ObserverMessagesToMasterEnum } from './const/observer.messages-to-master.enum';
import { InObserverCreatedTransactionDTO } from './dto/in.observer.created-transaction.dto';

@Controller('observer')
@UsePipes(new ValidationPipe())
export class ObserverController {
  constructor(
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,

    private readonly eventBus: EventBus,
  ) { }

  @MessagePattern(ObserverMessagesToMasterEnum.CreatedTransaction)
  async createdTransaction(dto: InObserverCreatedTransactionDTO) {
    try {
      const account = await this.accountService.getAccountById(dto.accountId);
      const transaction = await this.transactionService.getTransactionById(dto.transactionId);

      this.eventBus.publish(new TransactionAddTransactionEvent({
        account,
        transaction,
        pushToRedis: false,
      }));
    } catch (e) {
      Logger.error(e.message, undefined, ObserverController.name);
    }
  }
}