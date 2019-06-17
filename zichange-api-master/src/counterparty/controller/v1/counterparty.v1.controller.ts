import { Body, Controller, Post, Request } from '@nestjs/common';
import { InCounterpartyV1CreateTransactionDTO } from '../../dto/v1/in/in.counterparty.v1.create-transaction.dto';
import { InCounterpartyV1StatusTransactionDTO } from '../../dto/v1/in/in.counterparty.v1.status-transaction.dto';
import { InCounterpartyV1TransactionHistoryDTO } from '../../dto/v1/in/in.counterparty.v1.transaction-history.dto';
import { InCounterpartyV1GetPriceDTO } from '../../dto/v1/in/in.counterparty.v1.get-price.dto';
import { OutCounterpartyV1CreateTransactionDTO } from '../../dto/v1/out/out.counterparty.v1.create-transaction.dto';
import { OutCounterpartyV1StatusTransactionDTO } from '../../dto/v1/out/out.counterparty.v1.status-transaction.dto';
import { OutCounterpartyV1TransactionHistoryDTO } from '../../dto/v1/out/out.counterparty.v1.transaction-history.dto';
import { OutCounterpartyV1GetPairsDTO } from '../../dto/v1/out/out.counterparty.v1.get-pairs.dto';
import { OutCounterpartyV1GetPriceDTO } from '../../dto/v1/out/out.counterparty.v1.get-price.dto';
import { CounterpartyV1Service } from '../../service/v1/counterparty.v1.service';
import { InCounterpartyV1GetLimitDTO } from '../../dto/v1/in/in.counterparty.v1.get-limit.dto';
import { OutCounterpartyV1GetLimitDTO } from '../../dto/v1/out/out.counterparty.v1.get-limit.dto';
import { CounterpartyApiKeyEntity } from '../../entity/counterparty.api-key.entity';
import { CounterpartyService } from '../../service/counterparty.service';
import { IpAddressIsNotAllowedException } from '../../exceptions/ip-address-is-not-allowed.exception';

@Controller('v1')
export class CounterpartyV1Controller {
  constructor(
    protected readonly counterpartyV1Service: CounterpartyV1Service,
    protected readonly counterpartyService: CounterpartyService,
  ) { }

  @Post('create_transaction')
  async createTransaction(
    @Body() dto: InCounterpartyV1CreateTransactionDTO,
    @Request() request,
  ): Promise<OutCounterpartyV1CreateTransactionDTO> {
    const apiKey = await this.prepareApiKey(request, '/api/v1/create_transaction', dto);

    return await this.counterpartyV1Service.createTransaction(apiKey, dto);
  }

  @Post('status_transaction')
  async statusTransaction(
    @Body() dto: InCounterpartyV1StatusTransactionDTO,
    @Request() request,
  ): Promise<OutCounterpartyV1StatusTransactionDTO> {
    const apiKey = await this.prepareApiKey(request, '/api/v1/status_transaction', dto);

    return await this.counterpartyV1Service.statusTransaction(apiKey, dto.transaction_id);
  }

  @Post('transaction_history')
  async transactionHistory(
    @Body() dto: InCounterpartyV1TransactionHistoryDTO,
    @Request() request,
  ): Promise<OutCounterpartyV1TransactionHistoryDTO[]> {
    const apiKey = await this.prepareApiKey(request, '/api/v1/transaction_history', dto);

    return await this.counterpartyV1Service.transactionHistory(apiKey, dto.email);
  }

  @Post('get_pairs')
  async getPairs(
    @Request() request,
  ): Promise<OutCounterpartyV1GetPairsDTO[]> {
    const apiKey = await this.prepareApiKey(request, '/api/v1/get_pairs', {});

    const pairs = await this.counterpartyV1Service.getPairs();
    return pairs.map(pair => new OutCounterpartyV1GetPairsDTO(pair));
  }

  @Post('get_limit')
  async getLimit(
    @Body() dto: InCounterpartyV1GetLimitDTO,
    @Request() request,
  ): Promise<OutCounterpartyV1GetLimitDTO[]> {
    const apiKey = await this.prepareApiKey(request, '/api/v1/get_limit', dto);

    return await this.counterpartyV1Service.getLimit(apiKey, dto.email);
  }

  @Post('get_limits')
  async getLimits(
    @Request() request,
  ) {
    const apiKey = await this.prepareApiKey(request, '/api/v1/get_limits', {});

    return await this.counterpartyV1Service.getLimits(apiKey);
  }

  @Post('get_price')
  async getPrice(
    @Body() dto: InCounterpartyV1GetPriceDTO,
    @Request() request,
  ): Promise<OutCounterpartyV1GetPriceDTO> {
    const apiKey = await this.prepareApiKey(request, '/api/v1/get_price', dto);

    const price = await this.counterpartyV1Service.getPrice(dto.pair_id);
    return { price };
  }

  // region Protected methods

  protected async verifyIpAddress(apiKeyEntity: CounterpartyApiKeyEntity, request: any) {
    const counterparty = await this.counterpartyService.getCounterpartyByAccountId(apiKeyEntity.accountId);

    if (!counterparty.useWhiteListIPs) {
      return;
    }

    const ip = request.connection.remoteAddress;
    const includes = counterparty.whiteListIPs.includes(ip);

    if (!includes) {
      throw new IpAddressIsNotAllowedException(ip);
    }
  }

  protected async prepareApiKey(request: any, endpoint: string, dto: object) {
    let apiKey = await this.counterpartyV1Service.getCounterpartyApiKey(request.headers);
    await this.verifyIpAddress(apiKey, request);
    apiKey = await this.counterpartyV1Service.updateNonce(apiKey, request);
    this.counterpartyV1Service.verifySignature(apiKey, request.headers, endpoint, dto);

    return apiKey;
  }

  // endregion
}