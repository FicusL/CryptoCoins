import { KycStatus } from '../../../../Dashboard/modules/Profile/constants/KycStatus';
import { IOutClientsDTO } from '../dto/IOutClientsDTO';
import { computed } from 'mobx';

export class ClientsModel {
  key: number;
  accountId: number;
  owner: string;
  email: string;
  kycStatus: KycStatus;
  limitBalance: number;
  transactionsAmount: number;
  feesAmount: number;
  registrationDate?: string;

  constructor(dto : IOutClientsDTO) {
    this.key = this.accountId = dto.accountId;
    this.owner = dto.firstName + dto.lastName;
    this.email = dto.email;
    this.kycStatus = dto.kycStatus;
    this.limitBalance = dto.limitBalance;
    this.transactionsAmount = dto.transactionsAmount;
    this.feesAmount = dto.feesAmount;
    this.registrationDate = dto.registrationDate;
  }

  @computed
  get date(): Date | undefined {
    if (this.registrationDate) {
      return new Date(this.registrationDate);
    }

    return undefined;
  }
}