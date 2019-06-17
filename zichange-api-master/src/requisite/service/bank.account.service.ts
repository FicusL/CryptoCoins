import { BankAccountRepository } from '../repository/bank.account.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccountEntity } from '../entity/bank.account.entity';
import { InBankAccountCreateDTO } from '../dto/in.bank.account.create.dto';
import { AccountService } from '../../account/service/account.service';
import { InternalServerErrorException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InBankAccountUpdateDTO } from '../dto/in.bank.account.update.dto';
import { BankAccountExceptions } from '../const/bank.account.exceptions';
import { DeleteBankAccountCommand } from '../commands/delete-bank-account.command';

export class BankAccountService {
  constructor(
    private readonly accountService: AccountService,

    @InjectRepository(BankAccountRepository)
    private readonly bankAccountRepository: BankAccountRepository,

    private readonly commandBus: CommandBus,
  ) { }

  async getById(id: number): Promise<BankAccountEntity> {
    let result: BankAccountEntity | undefined;

    try {
      result = await this.bankAccountRepository.findOne(id, { loadRelationIds: true });
    } catch (e) {
      throw new BankAccountExceptions.BankAccountNotFound();
    }

    if (!result) {
      throw new BankAccountExceptions.BankAccountNotFound();
    }

    result.account = { id: result.account as any as number } as any; // Fix for typeorm unexpected behaviour
    return result;
  }

  async getByAccountId(accountId: number): Promise<BankAccountEntity[]> {
    return this.bankAccountRepository.findByAccountId(accountId);
  }

  async create(payload: InBankAccountCreateDTO): Promise<BankAccountEntity> {
    const account = await this.accountService.getAccountById(payload.accountId);
    if (!account) {
      throw new BankAccountExceptions.AccountNotFound();
    }

    let entity = new BankAccountEntity();
    entity.label = payload.label || '';
    entity.bankName = payload.bankName;
    entity.currency = payload.currency;
    entity.IBAN = payload.IBAN;
    entity.BIC = payload.BIC;
    entity.recipientName = payload.recipientName;
    entity.account = account;

    try {
      entity = await this.bankAccountRepository.save(entity);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return entity;
  }

  async update(id: number, payload: InBankAccountUpdateDTO): Promise<BankAccountEntity> {
    let entity = await this.getById(id);
    if (!entity) {
      throw new BankAccountExceptions.BankAccountNotFound();
    }

    entity.label = payload.label || '';
    entity.bankName = payload.bankName;
    entity.currency = payload.currency;
    entity.IBAN = payload.IBAN;
    entity.BIC = payload.BIC;
    entity.currency = payload.currency;
    entity.recipientName = payload.recipientName;

    try {
      entity = await this.bankAccountRepository.save(entity);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return entity;
  }

  async delete(id: number) {
    const entity = await this.bankAccountRepository.findOne(id);
    if (!entity) {
      throw new BankAccountExceptions.BankAccountNotFound();
    }

    await this.commandBus.execute(new DeleteBankAccountCommand(entity.id));

    await this.bankAccountRepository.delete(id);
  }
}