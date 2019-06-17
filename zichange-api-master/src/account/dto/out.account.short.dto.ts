import {KycStatus} from '../../kyc/const/kyc.status';
import {AccountEntity} from '../entitiy/account.entity';
import {ApiModelProperty, ApiModelPropertyOptional} from '@nestjs/swagger';
import {OutCurrencyBalanceDTO} from '../../transaction/dto/out.currency.balance.dto';

export class OutAccountShortDto {
  @ApiModelProperty() id: number;
  @ApiModelPropertyOptional() mainAccountId?: number;
  @ApiModelProperty() email: string;
  @ApiModelProperty() registrationDate: Date;

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

  @ApiModelPropertyOptional({enum: KycStatus})
  kycStatus?: KycStatus;

  @ApiModelProperty({isArray: true, type: OutCurrencyBalanceDTO})
  balances: OutCurrencyBalanceDTO[];

  @ApiModelProperty()
  isBlocked: boolean;

  @ApiModelPropertyOptional()
  blockingReason?: string;

  constructor(account: AccountEntity, balances: OutCurrencyBalanceDTO[]) {
    this.id = account.id;
    this.mainAccountId = account.mainAccountId;
    this.email = account.email;
    this.registrationDate = account.registrationDate;

    this.btcWalletAddress = account.btcWalletAddress;
    this.ethWalletAddress = account.ethWalletAddress;
    this.ltcWalletAddress = account.ltcWalletAddress;
    this.zcnWalletAddress = account.zcnWalletAddress;

    this.xrpWalletAddress = account.xrpWalletAddress;
    this.bchWalletAddress = account.bchWalletAddress;
    this.xlmWalletAddress = account.xlmWalletAddress;
    this.dashWalletAddress = account.dashWalletAddress;
    this.zecWalletAddress = account.zecWalletAddress;
    this.bsvWalletAddress = account.bsvWalletAddress;
    this.btgWalletAddress = account.btgWalletAddress;

    this.kycStatus = account.kyc ? account.kyc.status : undefined;
    this.balances = balances;

    this.isBlocked = account.isBlocked;
    this.blockingReason = account.blockingReason;
  }
}