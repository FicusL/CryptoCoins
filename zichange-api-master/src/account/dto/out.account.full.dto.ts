import { AccountType } from '../const/account.type.enum';
import { KycStatus } from '../../kyc/const/kyc.status';
import { OutCurrencyBalanceDTO } from '../../transaction/dto/out.currency.balance.dto';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { AccountEntity } from '../entitiy/account.entity';
import { OutBankAccountDTO } from '../../requisite/dto/out.bank.account.dto';
import { OutCryptoWalletDTO } from '../../requisite/dto/out.crypto.wallet.dto';

export class OutAccountFullDto {
  @ApiModelProperty()
  id: number;

  @ApiModelPropertyOptional()
  mainAccountId?: number;

  @ApiModelPropertyOptional({ enum: KycStatus })
  kycStatus: KycStatus;

  @ApiModelProperty()
  registrationDate: Date;

  @ApiModelProperty() isAdmin: boolean;
  @ApiModelProperty() isTrader: boolean;
  @ApiModelProperty() isAmlOfficer: boolean;

  @ApiModelProperty() email: string;
  @ApiModelProperty({enum: AccountType}) type: AccountType;
  @ApiModelProperty() isActivated: boolean;
  @ApiModelProperty() twoFaEnabled: boolean;

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

  @ApiModelProperty({ isArray: true, type: OutBankAccountDTO })
  bankAccounts: OutBankAccountDTO[];
  @ApiModelProperty({ isArray: true, type: OutCryptoWalletDTO })
  cryptoWallets: OutCryptoWalletDTO[];

  @ApiModelProperty({ isArray: true, type: OutCurrencyBalanceDTO })
  balances: OutCurrencyBalanceDTO[];

  @ApiModelProperty()
  isBlocked: boolean;

  @ApiModelPropertyOptional()
  blockingReason?: string;

  constructor(account: AccountEntity, balances: OutCurrencyBalanceDTO[]) {
    this.id = account.id;
    this.mainAccountId = account.mainAccountId;
    this.kycStatus = account.kyc ? account.kyc.status : KycStatus.Unapproved;
    this.registrationDate = account.registrationDate;

    this.isAdmin = account.isAdmin;
    this.isTrader = account.isTrader;
    this.isAmlOfficer = account.isAmlOfficer;

    this.email = account.email;
    this.type = account.type;
    this.isActivated = account.isActivated;
    this.twoFaEnabled = account.twoFaEnabled;

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

    if (account.bankAccounts) {
      this.bankAccounts = account.bankAccounts.map(el => new OutBankAccountDTO(el));
    } else {
      this.bankAccounts = [];
    }

    if (account.cryptoWallets) {
      this.cryptoWallets = account.cryptoWallets.map(el => new OutCryptoWalletDTO(el));
    } else {
      this.cryptoWallets = [];
    }

    this.balances = balances;

    this.isBlocked = account.isBlocked;
    this.blockingReason = account.blockingReason;
  }
}