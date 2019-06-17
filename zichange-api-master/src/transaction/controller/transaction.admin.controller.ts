import { Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Post, Put, Session, UseGuards } from '@nestjs/common';
import { AuthorizedGuardAdminHttp } from '../../core/guard/authorized.guard.admin.http';
import { InTransactionsGetFiltersDTO } from '../dto/in.transactions.get-filters.dto';
import { TransactionAdminService } from '../service/transaction.admin.service';
import { OutTransactionDTO } from '../dto/transaction/out.transaction.dto';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthorizedGuardTraderHttp } from '../../core/guard/authorized.guard.trader.http';
import { IAccountSession } from '../../account/abstract/account.session.interface';
import { InTransactionChangeStatusDTO } from '../dto/in.transaction.change.status.dto';
import { TransactionStatus } from '../const/transaction.status.enum';
import { AccountService } from '../../account/service/account.service';
import { TransactionService } from '../service/transaction.service';
import { TransactionEntity } from '../entity/transaction.entity';
import { InTransactionChangeAmountDTO } from '../dto/in.transaction.change-amount.dto';
import { InTransactionChangeFeeAmountDTO } from '../dto/in.transaction.change-fee-amount.dto';
import { TransactionHTTPExceptions } from '../const/transaction.http.exceptions';
import { OutTransactionsAmountDTO } from '../dto/out.transactions.amount.dto';
import { InTransactionsGetAmountDTO } from '../dto/in.transactions.get-amount.dto';
import { OutAdminExtendedTransactionDTO } from '../dto/out.admin-extended-transaction.dto';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { OutTransactionExtendedBalancesDTO } from '../dto/balances/out.transaction.extended-balances.dto';

@Controller('admin/transactions')
export class TransactionAdminController {
  constructor(
    private readonly transactionAdminService: TransactionAdminService,
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
  ) { }

  @Get('accounts/:accountId/extended_balances/:currencyForCalculations')
  @ApiOperation({title: 'Get extended balances'})
  @UseGuards(AuthorizedGuardAdminHttp)
  @ApiResponse({ status: 200, type: OutTransactionExtendedBalancesDTO })
  async getExtendedBalances(
    @Param('accountId', new ParseIntPipe()) accountId: number,
    @Param('currencyForCalculations') currencyForCalculations: string,
  ): Promise<OutTransactionExtendedBalancesDTO> {
    return await this.transactionService.getExtendedBalances(accountId, currencyForCalculations.toUpperCase());
  }

  @Post()
  @UseGuards(AuthorizedGuardAdminHttp)
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Get transaction with filters'})
  @ApiResponse({ status: 200, type: OutAdminExtendedTransactionDTO, isArray: true })
  async getTransactions(
    @Body() dto: InTransactionsGetFiltersDTO,
  ): Promise<OutAdminExtendedTransactionDTO[]> {
    const transactions = await this.transactionAdminService.getTransactions(dto);

    const accountsIds = transactions.map(transaction => transaction.accountId);
    const accounts = await this.accountService.getAccountsByIds(accountsIds);

    const accountIdToAccount = new Map<number, AccountEntity>();
    accounts.forEach(account => accountIdToAccount.set(account.id, account));

    return transactions.map(transaction => {
      return new OutAdminExtendedTransactionDTO(transaction, accountIdToAccount.get(transaction.accountId)!);
    });
  }

  @Post('amount')
  @UseGuards(AuthorizedGuardAdminHttp)
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Get the number of transactions that match the filters'})
  @ApiResponse({ status: 200, type: OutTransactionsAmountDTO })
  async getAmountTransactions(
    @Body() dto: InTransactionsGetAmountDTO,
  ): Promise<OutTransactionsAmountDTO> {
    const amount = await this.transactionAdminService.getAmountOfTransactions(dto);
    return new OutTransactionsAmountDTO(amount);
  }

  @Put(':referenceId/status')
  @UseGuards(AuthorizedGuardTraderHttp)
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Change transaction status'})
  async changeTransactionStatus(
    @Param('referenceId') referenceId: string,
    @Session() session: IAccountSession,
    @Body() dto: InTransactionChangeStatusDTO,
  ) {
    if (session.isTrader) {
      const noAccess =
        dto.status !== TransactionStatus.Approved &&
        dto.status !== TransactionStatus.Rejected &&
        dto.status !== TransactionStatus.PaymentFailed;

      if (noAccess) {
        throw new ForbiddenException();
      }
    }

    const transactionId = TransactionEntity.getTransactionIdByReferenceId(referenceId);
    const adminAccount = await this.accountService.getAccountById(session.accountId);
    const result = await this.transactionService.changeTransactionStatusByTransactionId(transactionId, dto, adminAccount);
    return new OutTransactionDTO(result);
  }

  @Put(':referenceId/fee_amount')
  @UseGuards(AuthorizedGuardTraderHttp)
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Update fee amount for transaction'})
  async changeTransactionFeeAmount(
    @Param('referenceId') referenceId: string,
    @Session() session: IAccountSession,
    @Body() dto: InTransactionChangeFeeAmountDTO,
  ) {
    const transaction = await this.transactionService.getTransactionByReferenceIdOnly(referenceId);

    const fees = InTransactionChangeFeeAmountDTO.convertToInterface(dto);
    const result = await this.transactionAdminService.changeTransactionFeeAmount(transaction, session.accountId, fees);

    return new OutTransactionDTO(result);
  }

  @Put('pending/:referenceId/amount')
  @UseGuards(AuthorizedGuardTraderHttp)
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Change amount pending transactions'})
  async changeTransactionAmountForPending(
    @Param('referenceId') referenceId: string,
    @Session() session: IAccountSession,
    @Body() dto: InTransactionChangeAmountDTO,
  ) {
    const transaction = await this.transactionService.getTransactionByReferenceIdOnly(referenceId);
    if (transaction.status !== TransactionStatus.Pending) {
      throw new TransactionHTTPExceptions.TransactionMustBePending();
    }

    const amounts = InTransactionChangeAmountDTO.ConvertToInterface(dto);
    const result = await this.transactionAdminService.changeTransactionAmount(transaction, session.accountId, amounts);

    return new OutTransactionDTO(result);
  }

  @Get(':referenceId/info')
  @UseGuards(AuthorizedGuardTraderHttp)
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Get transaction info'})
  @ApiResponse({ status: 200, type: OutAdminExtendedTransactionDTO})
  async getTransactionInfoById(
    @Param('referenceId') referenceId: string,
  ): Promise<OutAdminExtendedTransactionDTO> {
    const transaction =  await this.transactionService.getTransactionByReferenceIdOnly(referenceId);
    const account = await this.accountService.getAccountById(transaction.accountId);
    return new OutAdminExtendedTransactionDTO(transaction, account);
  }
}