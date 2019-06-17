export class RealtimeMicroservicesUpdateKycStatusDTO {
  accountId: number;
  kycId: number;

  constructor(data?: RealtimeMicroservicesUpdateKycStatusDTO) {
    if (!data) {
      return;
    }

    this.accountId = data.accountId;
    this.kycId = data.kycId;
  }
}