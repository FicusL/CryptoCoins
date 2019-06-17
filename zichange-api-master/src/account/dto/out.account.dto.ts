import {ApiModelProperty, ApiModelPropertyOptional} from '@nestjs/swagger';
import {KycStatus} from '../../kyc/const/kyc.status';
import {AccountType} from '../const/account.type.enum';
import { AccountEntity } from 'account/entitiy/account.entity';
import { KycEntity } from 'kyc/entity/kyc.entity';

export class OutAccountDTO {
  @ApiModelProperty()
  id: number;

  @ApiModelPropertyOptional()
  mainAccountId?: number;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  type: AccountType;

  @ApiModelPropertyOptional() btcWalletAddress?: string;
  @ApiModelPropertyOptional() ethWalletAddress?: string;
  @ApiModelPropertyOptional() ltcWalletAddress?: string;
  @ApiModelPropertyOptional() zcnWalletAddress?: string;

  @ApiModelPropertyOptional() xrpWalletAddress?: string;
  @ApiModelPropertyOptional() bchWalletAddress?: string;
  @ApiModelPropertyOptional() xlmWalletAddress?: string;
  @ApiModelPropertyOptional() dashWalletAddress?: string;
  @ApiModelPropertyOptional() zecWalletAddress?: string;
  @ApiModelPropertyOptional() bsvWalletAddress?: string;
  @ApiModelPropertyOptional() btgWalletAddress?: string;

  @ApiModelProperty()
  twoFaEnabled: boolean;

  @ApiModelProperty()
  kycStatus: KycStatus;

  @ApiModelProperty()
  kycForbiddenSend: boolean;

  @ApiModelProperty()
  kycRejectReason: string;

  @ApiModelPropertyOptional()
  referId?: number;

  @ApiModelProperty()
  isPartner: boolean;

  @ApiModelProperty()
  isCounterparty: boolean;

  @ApiModelPropertyOptional()
  referralToken?: string;

  @ApiModelPropertyOptional()
  exchangeCommissionCoefficient?: string;

  @ApiModelProperty()
  isBlocked: boolean;

  @ApiModelPropertyOptional()
  blockingReason?: string;

  constructor(entity: AccountEntity, kyc?: KycEntity) {
    this.id = entity.id;
    this.mainAccountId = entity.mainAccountId;
    this.email = entity.email;
    this.type = entity.type;

    this.btcWalletAddress = entity.btcWalletAddress;
    this.ethWalletAddress = entity.ethWalletAddress;
    this.ltcWalletAddress = entity.ltcWalletAddress;
    this.zcnWalletAddress = entity.zcnWalletAddress;

    this.xrpWalletAddress = entity.xrpWalletAddress;
    this.bchWalletAddress = entity.bchWalletAddress;
    this.xlmWalletAddress = entity.xlmWalletAddress;
    this.dashWalletAddress = entity.dashWalletAddress;
    this.zecWalletAddress = entity.zecWalletAddress;
    this.bsvWalletAddress = entity.bsvWalletAddress;
    this.btgWalletAddress = entity.btgWalletAddress;

    this.twoFaEnabled = entity.twoFaEnabled;

    if (kyc) {
      this.kycStatus = kyc.status;
      this.kycRejectReason = kyc.rejectReason || '';
      this.kycForbiddenSend = kyc.forbiddenSend;
    } else {
      this.kycStatus = KycStatus.Unapproved;
      this.kycRejectReason = '';
      this.kycForbiddenSend = false;
    }

    this.referId = entity.referId;
    this.isPartner = entity.isPartner;
    this.isCounterparty = entity.isCounterparty;
    this.referralToken = entity.referralToken;

    this.exchangeCommissionCoefficient = entity.exchangeCommissionCoefficient
        ? entity.exchangeCommissionCoefficient.toString()
        : undefined;

    this.isBlocked = entity.isBlocked;
    this.blockingReason = entity.blockingReason;
  }
}