import { Controller, Get, Param, ParseIntPipe, Session, UseGuards } from '@nestjs/common';
import { AccountService } from '../../account/service/account.service';
import { IAccountSession } from '../../account/abstract/account.session.interface';
import { AccountAccessGuard } from '../../core/guard/account.access.guard';
import { OutYearEURPaymentDTO } from '../dto/out.year.eur.payment.dto';
import { AccountAccessParam } from '../../core/decorators/account.access.param.decorator';
import { BigNumber } from 'bignumber.js';
import { TransactionService } from '../service/transaction.service';
import { OutCurrencyBalanceDTO } from '../dto/out.currency.balance.dto';

@Controller('accounts')
@UseGuards(AccountAccessGuard.Http)
export class TransactionAccountController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
  ) { }

  @Get('/:accountId/balances')
  @AccountAccessParam('accountId')
  async getBalance(
    @Param('accountId', new ParseIntPipe()) accountId: number,
    @Session() session: IAccountSession,
  ) {
    const balances = await this.transactionService.getBalanceByAccountId(accountId);
    return OutCurrencyBalanceDTO.convertFromMap(balances);
  }

  @Get('/:accountId/ytd_payments')
  @AccountAccessParam('accountId')
  async getPaymentEUREquivalentForYear(
    @Param('accountId', new ParseIntPipe()) accountId: number,
    @Session() session: IAccountSession,
  ) {
    const account = await this.accountService.getAccountById(accountId);
    // const yearPayment = await this.transactionService.getPaymentEUREquivalentForYear(account);
    return new OutYearEURPaymentDTO(new BigNumber('0'));
  }
}