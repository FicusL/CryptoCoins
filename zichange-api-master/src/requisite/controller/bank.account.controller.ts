import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Session, UseGuards } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { InBankAccountCreateDTO } from '../dto/in.bank.account.create.dto';
import { AuthorizedGuardHttp } from '../../core/guard/authorized.guard.http';
import { IAccountSession } from '../../account/abstract/account.session.interface';
import { AccountAccessGuard } from '../../core/guard/account.access.guard';
import { BankAccountService } from '../service/bank.account.service';
import { InBankAccountUpdateDTO } from '../dto/in.bank.account.update.dto';
import { BankAccountExceptions } from '../const/bank.account.exceptions';

@Controller('bank_account')
@ApiUseTags('Bank account')
@UseGuards(AuthorizedGuardHttp)
export class BankAccountController {
  constructor(
    private readonly bankAccountService: BankAccountService,
  ) { }

  @Post()
  async create(
    @Session() session: IAccountSession,
    @Body() payload: InBankAccountCreateDTO,
  ) {
    const { accountId } = payload;
    AccountAccessGuard.verifyAccess(accountId, session);
    return await this.bankAccountService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Session() session: IAccountSession,
    @Body() payload: InBankAccountUpdateDTO,
  ) {
    const bankAccount = await this.bankAccountService.getById(id);
    if (!bankAccount) {
      throw new BankAccountExceptions.BankAccountNotFound();
    }

    try {
      AccountAccessGuard.verifyAccess(bankAccount.account.id, session);
    } catch (e) {
      throw new BankAccountExceptions.BankAccountNotFound();
    }

    return await this.bankAccountService.update(id, payload);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseIntPipe()) id: number,
    @Session() session: IAccountSession,
  ) {
    const bankAccount = await this.bankAccountService.getById(id);
    if (!bankAccount) {
      throw new BankAccountExceptions.BankAccountNotFound();
    }

    try {
      AccountAccessGuard.verifyAccess(bankAccount.account.id, session);
    } catch (e) {
      throw new BankAccountExceptions.BankAccountNotFound();
    }

    await this.bankAccountService.delete(id);
  }
}