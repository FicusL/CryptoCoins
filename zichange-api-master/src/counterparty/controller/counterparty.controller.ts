import {
  Body,
  Controller,
  Delete,
  FileFieldsInterceptor,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Session,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthorizedGuardCounterpartyHttp } from '../../core/guard/authorized.guard.counterparty.http';
import { IAccountSession } from '../../account/abstract/account.session.interface';
import { CounterpartyService } from '../service/counterparty.service';
import { AccountService } from '../../account/service/account.service';
import { InTransactionsGetFiltersDTO } from '../../transaction/dto/in.transactions.get-filters.dto';
import { OutTransactionsAmountDTO } from '../../transaction/dto/out.transactions.amount.dto';
import { InCounterpartyGenerateApiKeyDTO } from '../dto/in.counterparty.generate-api-key.dto';
import { CounterpartyApiKeyNotFoundException } from '../exceptions/counterparty-api-key-not-found.exception';
import { OutCounterpartyApiKeyDTO } from '../dto/out.counterparty.api-key.dto';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { OutCounterpartyGenerateApiKeyDTO } from '../dto/out.counterparty.generate-api-key.dto';
import { OutCounterpartyTransactionDTO } from '../dto/out.counterparty.transaction.dto';
import { OutCounterpartyWhiteListIpDTO } from '../dto/out.counterparty.white-list-ip.dto';
import { Validator } from 'class-validator';
import { IpAddressHasIncorrectFormatException } from '../exceptions/ip-address-has-incorrect-format.exception';
import { InCounterpartyGetAccountsFilterDTO } from '../dto/in.counterparty.get-accounts-filter.dto';
import { OutCoreAmountDTO } from '../../core/dto/out.core.amount.dto';
import { OutCounterpartyAccountDTO } from '../dto/out.counterparty.account.dto';
import { OutCounterpartyBalanceFromFeesDTO } from '../dto/out.counterparty.balance-from-fees.dto';
import { OutCounterpartyUrlDTO } from '../dto/out.counterparty.url.dto';
import { InCounterpartySetUrlDTO } from '../dto/in.counterparty.set-url.dto';
import { OutCounterpartyLetterTextFooterDTO } from '../dto/out.counterparty.letter-text-footer.dto';
import { InCounterpartyLetterTextFooterDTO } from '../dto/in.counterparty.letter-text-footer.dto';

@Controller('counterparties')
@UseGuards(AuthorizedGuardCounterpartyHttp)
export class CounterpartyController {
  constructor(
    protected readonly counterpartyService: CounterpartyService,
    protected readonly accountService: AccountService,
  ) { }

  // region Api keys

  @Get('api_keys')
  @ApiOperation({title: 'Get all API keys'})
  @ApiResponse({ status: 200, type: OutCounterpartyApiKeyDTO, isArray: true })
  async getApiKeys(
    @Session() session: IAccountSession,
  ): Promise<OutCounterpartyApiKeyDTO[]> {
    const counterpartyAccount = await this.accountService.getAccountById(session.accountId);
    const apiKeys = await this.counterpartyService.getApiKeys(counterpartyAccount);
    return apiKeys.map(key => new OutCounterpartyApiKeyDTO(key));
  }

  @Post('api_keys')
  @ApiOperation({title: 'Create API keys'})
  @ApiResponse({ status: 200, type: OutCounterpartyGenerateApiKeyDTO })
  async generateApiKeys(
    @Session() session: IAccountSession,
    @Body() dto: InCounterpartyGenerateApiKeyDTO,
  ): Promise<OutCounterpartyGenerateApiKeyDTO> {
    const counterpartyAccount = await this.accountService.getAccountById(session.accountId);
    return await this.counterpartyService.generateApiKeys(counterpartyAccount, dto.label);
  }

  @Delete('api_keys/:apiKeyId')
  @ApiOperation({title: 'Delete API key'})
  async deleteApiKeys(
    @Session() session: IAccountSession,
    @Param('apiKeyId', new ParseIntPipe()) apiKeyId: number,
  ) {
    const counterpartyAccount = await this.accountService.getAccountById(session.accountId);

    const apiKey = await this.counterpartyService.getApiKey(apiKeyId);
    if (apiKey.accountId !== counterpartyAccount.id) {
      throw new CounterpartyApiKeyNotFoundException();
    }

    await this.counterpartyService.deleteApiKeys(apiKey);
  }

  // endregion

  // region Url

  @Post('url')
  @ApiOperation({title: 'Set counterparty url'})
  @ApiResponse({ status: 200, type: OutCounterpartyUrlDTO })
  async setCounterpartyUrl(
    @Session() session: IAccountSession,
    @Body() dto: InCounterpartySetUrlDTO,
  ): Promise<OutCounterpartyUrlDTO> {
    let counterparty = await this.counterpartyService.getCounterpartyByAccountId(session.accountId);

    counterparty = await this.counterpartyService.setUrl(counterparty, dto.url);
    return { url: counterparty.url };
  }

  // endregion

  // region Letter Text Footer

  @Post('letter_text_footer')
  @ApiOperation({title: 'Set counterparty Letter Text Footer'})
  @ApiResponse({ status: 200, type: OutCounterpartyLetterTextFooterDTO })
  async setCounterpartyLetterTextFooter(
    @Session() session: IAccountSession,
    @Body() dto: InCounterpartyLetterTextFooterDTO,
  ): Promise<OutCounterpartyLetterTextFooterDTO> {
    let counterparty = await this.counterpartyService.getCounterpartyByAccountId(session.accountId);

    counterparty = await this.counterpartyService.setCounterpartyLetterTextFooter(counterparty, dto.letterTextFooter);
    return { letterTextFooter: counterparty.letterTextFooter };
  }

  @Get('letter_text_footer')
  @ApiOperation({title: 'Get counterparty Letter Text Footer'})
  @ApiResponse({ status: 200, type: OutCounterpartyLetterTextFooterDTO })
  async getCounterpartyLetterTextFooter(
    @Session() session: IAccountSession,
  ): Promise<OutCounterpartyLetterTextFooterDTO> {
    const counterparty = await this.counterpartyService.getCounterpartyByAccountId(session.accountId);

    return { letterTextFooter: counterparty.letterTextFooter };
  }

  // endregion

  // region Accounts

  @Post('accounts')
  @ApiOperation({title: 'Get accounts of counterparty with filters'})
  @ApiResponse({ status: 200, type: OutCounterpartyAccountDTO, isArray: true })
  async getAccounts(
    @Session() session: IAccountSession,
    @Body() dto: InCounterpartyGetAccountsFilterDTO,
  ): Promise<OutCounterpartyAccountDTO[]> {
    const counterpartyAccount = await this.accountService.getAccountById(session.accountId);

    return await this.counterpartyService.getAccountsOfCounterparty(counterpartyAccount, dto);
  }

  @Post('accounts/amount')
  @ApiOperation({ title: 'Get amount of accounts of counterparty with filters' })
  @ApiResponse({ status: 200, type: OutCoreAmountDTO })
  async getAccountsAmount(
    @Session() session: IAccountSession,
  ): Promise<OutCoreAmountDTO> {
    const counterpartyAccount = await this.accountService.getAccountById(session.accountId);

    const amount = await this.counterpartyService.getAccountsAmount(counterpartyAccount);
    return { amount };
  }

  // endregion

  // region Balance

  @Get('balance/fee')
  @ApiOperation({title: 'Get counterparty balance from fees'})
  @ApiResponse({ status: 200, type: OutCounterpartyBalanceFromFeesDTO, isArray: true })
  async getBalanceFromFees(
    @Session() session: IAccountSession,
  ): Promise<OutCounterpartyBalanceFromFeesDTO[]> {
    const counterpartyAccount = await this.accountService.getAccountById(session.accountId);

    return await this.counterpartyService.getBalanceFromFees(counterpartyAccount);
  }

  // endregion

  // region Transactions

  @Post('transactions')
  @ApiOperation({ title: 'Get transaction with filters' })
  @ApiResponse({ status: 200, type: OutCounterpartyTransactionDTO, isArray: true })
  async getTransactions(
    @Session() session: IAccountSession,
    @Body() dto: InTransactionsGetFiltersDTO,
  ): Promise<OutCounterpartyTransactionDTO[]> {
    const counterpartyAccount = await this.accountService.getAccountById(session.accountId);
    return await this.counterpartyService.getTransactions(counterpartyAccount, dto);
  }

  @Post('transactions/amount')
  @ApiOperation({title: 'Get transactions amount with filters'})
  @ApiResponse({ status: 200, type: OutTransactionsAmountDTO })
  async getAmountOfTransactions(
    @Session() session: IAccountSession,
    @Body() dto: InTransactionsGetFiltersDTO,
  ): Promise<OutTransactionsAmountDTO> {
    const counterpartyAccount = await this.accountService.getAccountById(session.accountId);
    const amount = await this.counterpartyService.getAmountOfTransactions(counterpartyAccount, dto);
    return new OutTransactionsAmountDTO(amount);
  }

  // endregion

  // region White list IP's

  @Post('white_list_ip')
  @ApiOperation({title: 'Enable white list'})
  @ApiResponse({ status: 200, type: OutCounterpartyWhiteListIpDTO })
  async enableWhiteListIPs(
    @Session() session: IAccountSession,
  ): Promise<OutCounterpartyWhiteListIpDTO> {
    let counterparty = await this.counterpartyService.getCounterpartyByAccountId(session.accountId);

    counterparty = await this.counterpartyService.setEnableForWhiteListIPs(counterparty, true);
    return new OutCounterpartyWhiteListIpDTO(counterparty);
  }

  @Delete('white_list_ip')
  @ApiOperation({title: 'Disable white list'})
  @ApiResponse({ status: 200, type: OutCounterpartyWhiteListIpDTO })
  async disableWhiteListIPs(
    @Session() session: IAccountSession,
  ): Promise<OutCounterpartyWhiteListIpDTO> {
    let counterparty = await this.counterpartyService.getCounterpartyByAccountId(session.accountId);

    counterparty = await this.counterpartyService.setEnableForWhiteListIPs(counterparty, false);
    return new OutCounterpartyWhiteListIpDTO(counterparty);
  }

  @Get('white_list_ip')
  @ApiOperation({title: 'Get white list IP info'})
  @ApiResponse({ status: 200, type: OutCounterpartyWhiteListIpDTO })
  async getWhiteListIPInfo(
    @Session() session: IAccountSession,
  ): Promise<OutCounterpartyWhiteListIpDTO> {
    const counterparty = await this.counterpartyService.getCounterpartyByAccountId(session.accountId);
    return new OutCounterpartyWhiteListIpDTO(counterparty);
  }

  @Post('white_list_ip/:ipAddress')
  @ApiOperation({title: 'Add IP to white list'})
  @ApiResponse({ status: 200, type: OutCounterpartyWhiteListIpDTO })
  async addIPToWhiteList(
    @Session() session: IAccountSession,
    @Param('ipAddress') ipAddress: string,
  ): Promise<OutCounterpartyWhiteListIpDTO> {
    this.validateIpAddress(ipAddress);

    let counterparty = await this.counterpartyService.getCounterpartyByAccountId(session.accountId);
    counterparty = await this.counterpartyService.addIPToWhiteList(counterparty, ipAddress);

    return new OutCounterpartyWhiteListIpDTO(counterparty);
  }

  @Delete('white_list_ip/:ipAddress')
  @ApiOperation({title: 'Remove IP from white list'})
  @ApiResponse({ status: 200, type: OutCounterpartyWhiteListIpDTO })
  async removeIPFromWhiteList(
    @Session() session: IAccountSession,
    @Param('ipAddress') ipAddress: string,
  ): Promise<OutCounterpartyWhiteListIpDTO> {
    this.validateIpAddress(ipAddress);

    let counterparty = await this.counterpartyService.getCounterpartyByAccountId(session.accountId);
    counterparty = await this.counterpartyService.removeIPFromWhiteList(counterparty, ipAddress);

    return new OutCounterpartyWhiteListIpDTO(counterparty);
  }

  protected validateIpAddress(ipAddress: string) {
    const validator = new Validator();

    if (!validator.isIP(ipAddress)) {
      throw new IpAddressHasIncorrectFormatException();
    }
  }

  // endregion

  // region Styles

  @Post('styles')
  @ApiOperation({title: 'Set counterparty styles'})
  async setStyles(
    @Session() session: IAccountSession,
    @Body() dto: object,
  ) {
    const counterparty = await this.counterpartyService.getCounterpartyByAccountId(session.accountId);
    const result = await this.counterpartyService.setStyles(counterparty, dto);
    return result.styles;
  }

  // endregion

  // region Logo

  @Post('logo')
  @ApiOperation({title: 'Set counterparty logo'})
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'logo', maxCount: 1 },
  ]))
  async setLogo(
    @Session() session: IAccountSession,
    @UploadedFiles() files: any,
  ) {
    this.counterpartyService.verifyFiles(files);

    const counterparty = await this.counterpartyService.getCounterpartyByAccountId(session.accountId);
    await this.counterpartyService.setLogo(counterparty, files);
  }

  // endregion
}