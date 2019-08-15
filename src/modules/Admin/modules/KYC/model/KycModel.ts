import { IOutKycDTO } from '../dto/IOutKycDTO';
import { AccountType } from '../../../../Shared/const/AccountType';
import { KycStatus } from '../../../../Dashboard/modules/Profile/constants/KycStatus';


export class KycModel {
  key: number;
  accountId: number;
  accountEmail: string;
  accountType: AccountType;
  status: KycStatus;
  rejectReason?: string;
  sumSubInfo?: {
    data?: object;
    status?: object;
    clientReason?: string;
    amlReason?: string;
  };
  createDate: Date;

  constructor(kycDto: IOutKycDTO) {
    this.key = this.accountId = kycDto.accountId;
    this.accountEmail = kycDto.accountEmail;
    this.accountType = kycDto.accountType;
    this.createDate = new Date(kycDto.createDate);
    this.status = kycDto.status;
    this.rejectReason = kycDto.rejectReason;
    if (kycDto.sumSubInfo) {
      this.sumSubInfo = {
        data: kycDto.sumSubInfo.data,
        status: kycDto.sumSubInfo.status,
        clientReason: kycDto.sumSubInfo.clientReason,
        amlReason: kycDto.sumSubInfo.amlReason,
      };
    }
  }
}