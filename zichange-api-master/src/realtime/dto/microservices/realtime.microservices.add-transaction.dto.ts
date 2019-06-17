export class RealtimeMicroservicesAddTransactionDTO {
  accountId: number;
  transactionReferenceId: string;

  constructor(data?: RealtimeMicroservicesAddTransactionDTO) {
    if (!data) {
      return;
    }

    this.accountId = data.accountId;
    this.transactionReferenceId = data.transactionReferenceId;
  }
}