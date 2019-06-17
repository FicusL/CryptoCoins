import { KycStatus } from '../const/kyc.status';

export interface IKycGetFilters {
  statuses?: KycStatus[];
  amount?: number;
  offset?: number;
}