import { TransactionStatus } from '../../const/transaction.status.enum';
import { TransactionType } from '../../const/transaction.type.enum';
import { OutTransactionCreationPartDTO } from './out.parts/out.transaction.creation.part.dto';
import { OutTransactionDepositPartDTO } from './out.parts/out.transaction.deposit.part.dto';
import { OutTransactionExchangePartDTO } from './out.parts/out.transaction.exchange.part.dto';
import { OutTransactionWithdrawalPartDTO } from './out.parts/out.transaction.withdrawal.part.dto';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { TransactionEntity } from '../../entity/transaction.entity';
import { OutTransactionReferralPartDTO } from './out.parts/out.transaction.referral.part.dto';
import { OutTransactionEditPartDTO } from './out.parts/out.transaction.edit.part.dto';

export class OutTransactionDTO {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty({ enum: TransactionStatus })
  status: TransactionStatus;

  @ApiModelProperty({ enum: TransactionStatus , isArray: true })
  possibleStatuses: TransactionStatus[];

  @ApiModelProperty()
  expectedDate: Date;

  @ApiModelProperty()
  referenceId: string;

  @ApiModelPropertyOptional({ type: OutTransactionDepositPartDTO })
  deposit?: OutTransactionDepositPartDTO;

  @ApiModelPropertyOptional({ type: OutTransactionExchangePartDTO })
  exchange?: OutTransactionExchangePartDTO;

  @ApiModelPropertyOptional({ type: OutTransactionWithdrawalPartDTO })
  withdrawal?: OutTransactionWithdrawalPartDTO;

  @ApiModelPropertyOptional({ type: OutTransactionReferralPartDTO })
  referral?: OutTransactionReferralPartDTO;

  @ApiModelProperty({ type: OutTransactionCreationPartDTO })
  creation?: OutTransactionCreationPartDTO;

  @ApiModelProperty({ type: OutTransactionEditPartDTO })
  edit?: OutTransactionEditPartDTO;

  @ApiModelProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiModelPropertyOptional()
  rejectReason?: string;

  @ApiModelPropertyOptional({ enum: TransactionStatus })
  rejectStatus?: TransactionStatus;

  // region Counterparty info

  @ApiModelPropertyOptional()
  counterpartyId?: number;

  @ApiModelPropertyOptional()
  counterpartyPairId?: number;

  @ApiModelProperty()
  counterpartyAmount: string;

  @ApiModelProperty()
  counterpartyFee: string;

  @ApiModelProperty()
  counterpartyFeePercent: string;

  @ApiModelProperty()
  counterpartyFeeEUREquivalent: string;

  @ApiModelPropertyOptional()
  counterpartyWallet?: string;

  @ApiModelProperty()
  counterpartyIsActivated: boolean;

  // endregion

  constructor(entity: TransactionEntity) {
    this.id = entity.id;
    this.type = entity.type;
    this.status = entity.status;
    this.expectedDate = entity.expectedDate;
    this.possibleStatuses = entity.possibleStatuses;
    this.referenceId = entity.referenceId;

    this.rejectReason = entity.rejectReason;
    this.rejectStatus = entity.rejectStatus;

    this.deposit = entity.deposit && entity.deposit.isActive
      ? new OutTransactionDepositPartDTO(entity.deposit)
      : undefined;

    this.exchange = entity.exchange && entity.exchange.isActive
      ? new OutTransactionExchangePartDTO(entity.exchange)
      : undefined;

    this.withdrawal = entity.withdrawal && entity.withdrawal.isActive
      ? new OutTransactionWithdrawalPartDTO(entity.withdrawal)
      : undefined;

    this.referral = entity.type === TransactionType.Referral
      ? new OutTransactionReferralPartDTO(entity)
      : undefined;

    this.creation = entity.creation
      ? new OutTransactionCreationPartDTO(entity.creation)
      : undefined;

    this.edit = entity.edit
      ? new OutTransactionEditPartDTO(entity.edit)
      : undefined;

    this.counterpartyId = entity.counterpartyId;
    this.counterpartyPairId = entity.counterpartyPairId;
    this.counterpartyAmount = entity.counterpartyAmount.toString();
    this.counterpartyFee = entity.counterpartyFee.toString();
    this.counterpartyFeePercent = entity.counterpartyFee.multipliedBy('100').dividedBy(entity.counterpartyAmount).toString();
    this.counterpartyFeeEUREquivalent = entity.counterpartyFeeEUREquivalent.toString();
    this.counterpartyWallet = entity.counterpartyWallet;
    this.counterpartyIsActivated = entity.counterpartyIsActivated;
  }
}