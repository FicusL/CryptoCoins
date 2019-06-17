export class RealtimeMicroservicesAddKycDTO {
  accountId: number;
  kycId: number;

  constructor(data?: RealtimeMicroservicesAddKycDTO) {
    if (!data) {
      return;
    }

    this.accountId = data.accountId;
    this.kycId = data.kycId;
  }
}