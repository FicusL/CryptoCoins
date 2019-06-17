import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../src/account/repository/account.repository';
import { AccountType } from '../../src/account/const/account.type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { createIdGenerator } from '../common/create-id-generator';
import { AccountEntity } from '../../src/account/entitiy/account.entity';

@Injectable()
export class KycHelperService {
  public static readonly AccountPassword = 'password';

  constructor(
    @InjectRepository(AccountRepository)
    protected readonly accountRepository: AccountRepository,
  ) { }

  async createAccountForTestKYC(accountType: AccountType): Promise<AccountEntity> {
    const id = getId();

    let account = new AccountEntity();

    account.email = `test_${id}@test.com`;
    account.type = accountType;
    account.password = KycHelperService.AccountPassword;
    account.isActivated = true;
    account.twoFaEnabled = true;
    account.btcWalletAddress = `btcWalletAddress_${id}`;
    account.ethWalletAddress = `ethWalletAddress_${id}`;
    account.ltcWalletAddress = `ltcWalletAddress_${id}`;
    account.zcnWalletAddress = `zcnWalletAddress_${id}`;

    account.xrpWalletAddress = `xrpWalletAddress_${id}`;
    account.bchWalletAddress = `bchWalletAddress_${id}`;
    account.xlmWalletAddress = `xlmWalletAddress_${id}`;
    account.dashWalletAddress = `dashWalletAddress_${id}`;
    account.zecWalletAddress = `zecWalletAddress_${id}`;
    account.bsvWalletAddress = `bsvWalletAddress_${id}`;
    account.btgWalletAddress = `btgWalletAddress_${id}`;

    account = await this.accountRepository.save(account);
    return account;
  }
}

const getId = createIdGenerator();