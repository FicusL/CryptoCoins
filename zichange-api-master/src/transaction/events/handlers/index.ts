import { TransactionAddTransactionEventHandler } from './transaction.add-transaction.event-handler';
import { TransactionChangeTransactionEventHandler } from './transaction.change-transaction.event-handler';

export const TransactionEventHandlers = [
  TransactionAddTransactionEventHandler,
  TransactionChangeTransactionEventHandler,
];