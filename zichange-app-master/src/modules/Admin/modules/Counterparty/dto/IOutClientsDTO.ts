import { KycStatus } from '../../../../Dashboard/modules/Profile/constants/KycStatus';

export interface IOutClientsDTO {
  key: number;
  accountId: number;
  firstName: string;
  lastName: string;
  email: string;
  kycStatus: KycStatus;
  limitBalance: number;
  transactionsAmount: number;
  feesAmount: number;
  registrationDate?: string;
}