export class RealtimeMicroservicesCreateAccountDTO {
  accountId: number;

  constructor(data?: RealtimeMicroservicesCreateAccountDTO) {
    if (!data) {
      return;
    }

    this.accountId = data.accountId;
  }
}