import { CryptoWalletRepository } from '../repository/crypto.wallet.repsoitory';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoWalletEntity } from '../entity/crypto.wallet.entity';
import { InCryptoWalletCreateDTO } from '../dto/in.crypto.wallet.create.dto';
import { AccountService } from '../../account/service/account.service';
import { InCryptoWalletUpdateDTO } from '../dto/in.crypto.wallet.update.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CryptoWalletExceptions } from '../const/crypto.wallet.exceptions';
import { DeleteCryptoWalletCommand } from '../commands/delete-crypto-wallet.command';

export class CryptoWalletService {
  constructor(
    private readonly accountService: AccountService,

    @InjectRepository(CryptoWalletRepository)
    private readonly cryptoWalletRepository: CryptoWalletRepository,

    private readonly commandBus: CommandBus,
  ) { }

  async getById(id: number): Promise<CryptoWalletEntity> {
    let result: CryptoWalletEntity | undefined;

    try {
      result = await this.cryptoWalletRepository.findOne(id, { loadRelationIds: true });
    } catch (e) {
      throw new CryptoWalletExceptions.WalletNotFound();
    }

    if (!result) {
      throw new CryptoWalletExceptions.WalletNotFound();
    }

    result.account = { id: result.account as any as number } as any; // Fix for typeorm unexpected behaviour
    return result;
  }

  async getByAccountId(accountId: number): Promise<CryptoWalletEntity[]> {
    return await this.cryptoWalletRepository.findByAccountId(accountId);
  }

  async create(payload: InCryptoWalletCreateDTO): Promise<CryptoWalletEntity> {
    const account = await this.accountService.getAccountById(payload.accountId);
    if (!account) {
      throw new CryptoWalletExceptions.AccountNotFound();
    }

    let entity = new CryptoWalletEntity();
    entity.label = payload.label || '';
    entity.address = payload.address;
    entity.account = account;

    try {
      entity = await this.cryptoWalletRepository.save(entity);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return entity;
  }

  async update(id: number, payload: InCryptoWalletUpdateDTO): Promise<CryptoWalletEntity> {
    let entity = await this.getById(id);
    if (!entity) {
      throw new CryptoWalletExceptions.WalletNotFound();
    }

    entity.label = payload.label;
    entity.address = payload.address;

    try {
      entity = await this.cryptoWalletRepository.save(entity);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return entity;
  }

  async delete(id: number) {
    const entity = await this.cryptoWalletRepository.findOne(id);
    if (!entity) {
      throw new CryptoWalletExceptions.WalletNotFound();
    }

    await this.commandBus.execute(new DeleteCryptoWalletCommand(entity.id));

    await this.cryptoWalletRepository.delete(id);
  }
}