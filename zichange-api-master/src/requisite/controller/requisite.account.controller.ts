import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { BankAccountService } from '../service/bank.account.service';
import { CryptoWalletService } from '../service/crypto.wallet.service';
import { AccountAccessGuard } from '../../core/guard/account.access.guard';
import { AccountAccessParam } from '../../core/decorators/account.access.param.decorator';
import { OutBankAccountDTO } from '../dto/out.bank.account.dto';
import { OutCryptoWalletDTO } from '../dto/out.crypto.wallet.dto';

@Controller('account')
@UseGuards(AccountAccessGuard.Http)
export class RequisiteAccountController {
  constructor(
    private readonly bankAccountService: BankAccountService,
    private readonly cryptoWalletService: CryptoWalletService,
  ) { }

  @Get(':accountId/bank_accounts')
  @AccountAccessParam('accountId')
  async getBankAccounts(
    @Param('accountId', new ParseIntPipe()) accountId: number,
  ): Promise<OutBankAccountDTO[]> {
    const bankAccounts = await this.bankAccountService.getByAccountId(accountId);
    return bankAccounts.map(value => new OutBankAccountDTO(value));
  }

  @Get(':accountId/crypto_wallets')
  @AccountAccessParam('accountId')
  async getCryptoWallets(
    @Param('accountId', new ParseIntPipe()) accountId: number,
  ): Promise<OutCryptoWalletDTO[]> {
    const cryptoWallets = await this.cryptoWalletService.getByAccountId(accountId);
    return cryptoWallets.map(value => new OutCryptoWalletDTO(value));
  }
}