import { BaseGatewayMessageHandler } from '../../../core/gateway/handler/base.gateway.message.handler';
import { InGetTransactionsDTO } from '../../dto/in.get-transactions.dto';
import { RealtimeTransactionClientMessages } from '../../const/realtime.client.messages.enum';
import { RealtimeClientGatewayClient } from '../../model/realtime.client.gateway.client';
import { OutGetTransactionsDTO } from '../../dto/out.get-transactions.dto';
import { TransactionService } from '../../../transaction/service/transaction.service';
import { OutTransactionDTO } from '../../../transaction/dto/transaction/out.transaction.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RealtimeTransactionRequestClientMessageHandler extends
  BaseGatewayMessageHandler<RealtimeClientGatewayClient, Promise<void>>
{
  constructor(
    private readonly transactionService: TransactionService,
  ) {
    super();
  }

  async handle(client: RealtimeClientGatewayClient, payload: InGetTransactionsDTO):
    Promise<void>
  {
    const isSortChanged = client.sort.by !== payload.sort.by
      || client.sort.direction !== payload.sort.direction;

    if (!isSortChanged) {
      client.amount += payload.amount;
    } else {
      client.amount = payload.amount;
      client.sort.by = payload.sort.by;
      client.sort.direction = payload.sort.direction;
    }

    const offset = client.amount - payload.amount;
    const transactions = await this.transactionService.getTransactionsByAccountId(client.accountId, client.sort, offset, payload.amount);
    const transactionsDTOs = transactions.map((item) => new OutTransactionDTO(item));

    client.socket.emit(RealtimeTransactionClientMessages.GetTransactions, new OutGetTransactionsDTO(transactionsDTOs));
  }
}