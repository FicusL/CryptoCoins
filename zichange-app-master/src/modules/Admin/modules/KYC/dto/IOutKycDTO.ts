import { AccountType } from '../../../../Shared/const/AccountType';
import { KycStatus } from '../../../../Dashboard/modules/Profile/constants/KycStatus';

export interface IOutKycDTO {
  id: number;
  accountId: number;
  accountEmail: string;
  accountType: AccountType;
  status: KycStatus;
  rejectReason?: string;
  lastEditBy?: number;
  sumSubInfo?: {
    data?: object;
    status?: object;
    clientReason?: string;
    amlReason?: string;
  };
  createDate: string;
  lastEditDate: string;
}