import { Body, Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RealtimeMessagesPatterns } from '../const/realtime.messages-patterns.enum';
import { RealtimeMicroservicesAddKycDTO } from '../dto/microservices/realtime.microservices.add-kyc.dto';
import { RealtimeClientGateway } from '../gateway/realtime.client.gateway';
import { RealtimeAdminGateway } from '../gateway/realtime.admin.gateway';
import { AccountService } from '../../account/service/account.service';
import { KycService } from '../../kyc/service/kyc.service';
import { TransactionService } from '../../transaction/service/transaction.service';
import { RealtimeMicroservicesAddTransactionDTO } from '../dto/microservices/realtime.microservices.add-transaction.dto';
import { RealtimeMicroservicesCreateAccountDTO } from '../dto/microservices/realtime.microservices.create-account.dto';
import { RealtimeMicroservicesUpdateKycStatusDTO } from '../dto/microservices/realtime.microservices.update-kyc-status.dto';
import { RealtimeMicroservicesUpdateSettingsDTO } from '../dto/microservices/realtime.microservices.update-settings.dto';

@Controller('realtime')
@UsePipes(new ValidationPipe())
export class RealtimeController {
  constructor(
    private readonly accountService: AccountService,
    private readonly kycService: KycService,
    private readonly transactionService: TransactionService,

    private readonly realtimeClientGateway: RealtimeClientGateway,
    private readonly realtimeAdminGateway: RealtimeAdminGateway,
  ) { }

  @MessagePattern(RealtimeMessagesPatterns.AddKyc)
  async addKyc(@Body() dto: RealtimeMicroservicesAddKycDTO) {
    try {
      const account = await this.accountService.getAccountById(dto.accountId);
      const kyc = await this.kycService.findMainKycByAccount(account);

      await this.realtimeClientGateway.onAddKYC(account, kyc);
      await this.realtimeAdminGateway.onAddKYC(kyc);
    } catch (e) {
      Logger.error(e.message, undefined, RealtimeController.name);
    }
  }

  @MessagePattern(RealtimeMessagesPatterns.AddTransaction)
  async addTransaction(@Body() dto: RealtimeMicroservicesAddTransactionDTO) {
    try {
      const account = await this.accountService.getAccountById(dto.accountId);
      const transaction = await this.transactionService.getTransactionByReferenceIdOnly(dto.transactionReferenceId);

      await this.realtimeAdminGateway.onAddTransaction(transaction);
      await this.realtimeClientGateway.onTransactionAdd(account, transaction);
    } catch (e) {
      Logger.error(e.message, undefined, RealtimeController.name);
    }
  }

  @MessagePattern(RealtimeMessagesPatterns.CreateAccount)
  async createAccount(@Body() dto: RealtimeMicroservicesCreateAccountDTO) {
    try {
      const account = await this.accountService.getAccountById(dto.accountId);

      await this.realtimeAdminGateway.onCreateUser(account);
    } catch (e) {
      Logger.error(e.message, undefined, RealtimeController.name);
    }
  }

  @MessagePattern(RealtimeMessagesPatterns.UpdateKycStatus)
  async updateKycStatus(@Body() dto: RealtimeMicroservicesUpdateKycStatusDTO) {
    try {
      const account = await this.accountService.getAccountById(dto.accountId);
      const kyc = await this.kycService.findMainKycByAccount(account);

      await this.realtimeClientGateway.onUpdateKYCStatus(account, kyc);
      await this.realtimeAdminGateway.onUpdateKYCStatus(kyc);
    } catch (e) {
      Logger.error(e.message, undefined, RealtimeController.name);
    }
  }

  @MessagePattern(RealtimeMessagesPatterns.UpdateSettings)
  async updateSettings(@Body() dto: RealtimeMicroservicesUpdateSettingsDTO) {
    try {
      await this.realtimeAdminGateway.onUpdateSettings(dto.params);
    } catch (e) {
      Logger.error(e.message, undefined, RealtimeController.name);
    }
  }
}