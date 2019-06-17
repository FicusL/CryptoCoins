import { IEvent } from '@nestjs/cqrs';
import { KycEntity } from '../../entity/kyc.entity';
import { AccountEntity } from '../../../account/entitiy/account.entity';

export class KycUpdateKycStatusEvent implements IEvent {
  constructor(
    public readonly kyc: KycEntity,
    public readonly account: AccountEntity,
  ) { }
}