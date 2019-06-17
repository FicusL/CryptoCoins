import { Injectable } from '@nestjs/common';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { CounterpartyEntity } from '../entity/counterparty.entity';
import { CounterpartyRepository } from '../repository/counterparty.repository';
import { CounterpartyNotFoundException } from '../exceptions/counterparty-not-found.exception';
import { AccountRepository } from '../../account/repository/account.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CounterpartyAdminService {
  constructor(
    @InjectRepository(CounterpartyRepository)
    protected readonly counterpartyRepository: CounterpartyRepository,

    @InjectRepository(AccountRepository)
    protected readonly accountRepository: AccountRepository,
  ) { }

  async createCounterparty(account: AccountEntity) {
    let counterparty = await this.counterpartyRepository.getByAccountId(account.id);
    if (!counterparty) {
      counterparty = new CounterpartyEntity();
    }

    counterparty.account = account;
    await this.counterpartyRepository.save(counterparty);

    account.isCounterparty = true;
    await this.accountRepository.save(account);
  }

  async disableCounterparty(account: AccountEntity) {
    const counterparty = await this.counterpartyRepository.getByAccountId(account.id);
    if (!counterparty) {
      throw new CounterpartyNotFoundException();
    }

    account.isCounterparty = false;
    await this.accountRepository.save(account);

    await this.counterpartyRepository.deleteByAccountId(account.id);
  }
}