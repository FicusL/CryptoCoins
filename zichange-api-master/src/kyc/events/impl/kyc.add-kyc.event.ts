import { IEvent } from '@nestjs/cqrs';
import { KycEntity } from '../../entity/kyc.entity';
import { AccountEntity } from '../../../account/entitiy/account.entity';

export class KycAddKycEvent implements IEvent {
  public readonly kyc: KycEntity;
  public readonly account: AccountEntity;
  public readonly buffer: Buffer;

  constructor(data: KycAddKycEvent) {
    this.kyc = data.kyc;
    this.account = data.account;
    this.buffer = data.buffer;
  }
}