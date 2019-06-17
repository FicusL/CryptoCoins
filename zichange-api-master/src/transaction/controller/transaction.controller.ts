import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Session, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AccountService } from '../../account/service/account.service';
import { IAccountSession } from '../../account/abstract/account.session.interface';
import { AuthorizedGuardHttp } from '../../core/guard/authorized.guard.http';
import { InTransactionFindByReferenceIdDTO } from '../dto/in.transaction.find.by.reference.id.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InCreateTransactionDTO } from '../dto/transaction/in.create.transaction.dto';
import { TransactionService } from '../service/transaction.service';
import { OutTransactionDTO } from '../dto/transaction/out.transaction.dto';
import { InTransactionWithdrawalUpdateDTO } from '../dto/in.transaction.withdrawal-update.dto';
import { InTransactionGetFeeDTO } from '../dto/fee/in.transaction.get-fee.dto';
import { TransactionFeePartService } from '../service/transaction-parts/transaction.fee-part.service';
import { BigNumber } from 'bignumber.js';
import { OutTransactionGetFeeDTO } from '../dto/fee/out.transaction.get-fee.dto';
import { OutTransactionGetMaxMinAmountDTO } from '../dto/min-amount/out.transaction.get-max-min-amount.dto';
import { InTransactionGetMaxMinAmountDTO } from '../dto/min-amount/in-transaction-get-max-min-amount.dto';
import { TransactionAmountsService } from '../service/transaction.amounts.service';
import { OutTransactionReferralDTO } from '../dto/transaction/out.transaction.referral.dto';
import { OutCurrencyBalanceDTO } from '../dto/out.currency.balance.dto';
import { AccountAccessGuard } from '../../core/guard/account.access.guard';
import { AuthorizedGuardAdminHttp } from '../../core/guard/authorized.guard.admin.http';
import { TransactionCreatorService } from '../service/transaction-creator.service';
import { OutTransactionExtendedBalancesDTO } from '../dto/balances/out.transaction.extended-balances.dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
    private readonly transactionCreateService: TransactionCreatorService,
    private readonly transactionFeePartService: TransactionFeePartService,
    private readonly transactionAmountsService: TransactionAmountsService,
  ) { }

  @Get('extended_balances/:currencyForCalculations')
  @ApiOperation({title: 'Get extended balances'})
  @UseGuards(AuthorizedGuardHttp)
  @ApiResponse({ status: 200, type: OutTransactionExtendedBalancesDTO })
  async getExtendedBalances(
    @Session() session: IAccountSession,
    @Param('currencyForCalculations') currencyForCalculations: string,
  ): Promise<OutTransactionExtendedBalancesDTO> {
    return await this.transactionService.getExtendedBalances(session.accountId, currencyForCalculations.toUpperCase());
  }

  @Get('referral')
  @ApiOperation({title: 'Get referral transactions'})
  @UseGuards(AuthorizedGuardHttp)
  @ApiResponse({ status: 200, type: OutTransactionReferralDTO, isArray: true })
  async getReferralTransactions(
    @Session() session: IAccountSession,
  ): Promise<OutTransactionReferralDTO[]> {
    const transactions = await this.transactionService.findReferralTransactionsByAccountId(session.accountId);
    return transactions.map(transaction => new OutTransactionReferralDTO(transaction));
  }

  @Get('referral_balance')
  @ApiOperation({title: 'Get referral balance'})
  @UseGuards(AuthorizedGuardHttp)
  @ApiResponse({ status: 200, type: OutCurrencyBalanceDTO, isArray: true })
  async getReferralTransactionsBalance(
    @Session() session: IAccountSession,
  ): Promise<OutCurrencyBalanceDTO[]> {
    const balances = await this.transactionService.getReferralTransactionsBalanceByAccountId(session.accountId);
    return OutCurrencyBalanceDTO.convertFromMap(balances);
  }

  @Post('/find_one')
  @UseGuards(AuthorizedGuardHttp)
  async getTransactionByReferenceId(
    @Session() session: IAccountSession,
    @Body() payload: InTransactionFindByReferenceIdDTO,
  ) {
    const result = await this.transactionService.getTransactionByReferenceId(session.accountId, payload.referenceId);
    AccountAccessGuard.verifyAccess(result.accountId, session);

    return new OutTransactionDTO(result);
  }

  @Post('/fee')
  @ApiOperation({title: 'Get fee'})
  @ApiResponse({ status: 200, type: OutTransactionGetFeeDTO})
  @UseGuards(AuthorizedGuardHttp)
  async getFee(
    @Body() dto: InTransactionGetFeeDTO,
  ): Promise<OutTransactionGetFeeDTO> {
    const options = {
      depositMethod: dto.depositMethod,
      withdrawalMethod: dto.withdrawalMethod,
      isB2BTransaction: false,
    };
    const fee = await this.transactionFeePartService.getFee(dto.type, dto.currency, new BigNumber(dto.amount), options);
    return new OutTransactionGetFeeDTO(fee.amount);
  }

  @Post('/max_min_amount')
  @ApiOperation({title: 'Get min amount'})
  @ApiResponse({ status: 200, type: OutTransactionGetMaxMinAmountDTO})
  @UseGuards(AuthorizedGuardHttp)
  async getMinAmount(
    @Body() dto: InTransactionGetMaxMinAmountDTO,
  ): Promise<OutTransactionGetMaxMinAmountDTO> {
    const options = {
      depositMethod: dto.depositMethod,
      withdrawalMethod: dto.withdrawalMethod,
    };
    const minAmount = this.transactionAmountsService.getMinAmount(dto.type, dto.currency, options);
    const maxAmount = this.transactionAmountsService.getMaxAmount(dto.type, dto.currency, options);

    return new OutTransactionGetMaxMinAmountDTO({ maxAmount, minAmount });
  }

  @Post('/validate')
  @UseGuards(AuthorizedGuardHttp)
  @HttpCode(200)
  async validate(
    @Session() session: IAccountSession,
    @Body() body: InCreateTransactionDTO,
  ) {
    const transaction = await this.transactionCreateService.createTransaction(session.accountId, InCreateTransactionDTO.toModel(body), true);
    return new OutTransactionDTO(transaction);
  }

  @Post('/')
  @UseGuards(AuthorizedGuardHttp)
  async createTransaction(
    @Session() session: IAccountSession,
    @Body() body: InCreateTransactionDTO,
  ) {
    const transaction = await this.transactionCreateService.createTransaction(session.accountId, InCreateTransactionDTO.toModel(body));
    return new OutTransactionDTO(transaction);
  }

  @Post('accounts/:accountId/create_transaction')
  @UseGuards(AuthorizedGuardAdminHttp)
  async createTransactionByAdmin(
    @Param('accountId', new ParseIntPipe()) accountId: number,
    @Body() body: InCreateTransactionDTO,
  ) {
    const transaction = await this.transactionCreateService.createTransaction(accountId, InCreateTransactionDTO.toModel(body));
    return new OutTransactionDTO(transaction);
  }

  @Put(':referenceId/withdrawal')
  @UseGuards(AuthorizedGuardHttp)
  async updateTransactionWithdrawal(
    @Session() session: IAccountSession,
    @Param('referenceId') referenceId: string,
    @Body() body: InTransactionWithdrawalUpdateDTO,
  ) {
    const { methodType, methodId, code } = body;
    const { accountId } = session;

    return new OutTransactionDTO(await this.transactionService.updateTransactionWithdrawal({
      referenceId, accountId,
      method: { type: methodType, id: methodId },
      code,
    }));
  }

  @Delete(':referenceId/pending')
  @ApiOperation({title: 'Cancel pending transaction'})
  @UseGuards(AuthorizedGuardHttp)
  async cancelPendingTransaction(
    @Session() session: IAccountSession,
    @Param('referenceId') referenceId: string,
  ) {
    const transaction = await this.transactionService.getTransactionByReferenceId(session.accountId, referenceId);
    return await this.transactionService.cancelPendingTransaction(transaction, session.accountId);
  }
}