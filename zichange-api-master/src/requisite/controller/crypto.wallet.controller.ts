import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Session, UseGuards } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { AuthorizedGuardHttp } from '../../core/guard/authorized.guard.http';
import { IAccountSession } from '../../account/abstract/account.session.interface';
import { AccountAccessGuard } from '../../core/guard/account.access.guard';
import { CryptoWalletService } from '../service/crypto.wallet.service';
import { InCryptoWalletUpdateDTO } from '../dto/in.crypto.wallet.update.dto';
import { InCryptoWalletCreateDTO } from '../dto/in.crypto.wallet.create.dto';
import { CryptoWalletExceptions } from '../const/crypto.wallet.exceptions';

@Controller('crypto_wallet')
@ApiUseTags('Crypto wallet')
@UseGuards(AuthorizedGuardHttp)
export class CryptoWalletController {
  constructor(
    private readonly cryptoWalletService: CryptoWalletService,
  ) { }

  @Post()
  async create(
    @Session() session: IAccountSession,
    @Body() payload: InCryptoWalletCreateDTO,
  ) {
    const { accountId } = payload;
    AccountAccessGuard.verifyAccess(accountId, session);
    return await this.cryptoWalletService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Session() session: IAccountSession,
    @Body() payload: InCryptoWalletUpdateDTO,
  ) {
    const cryptoWallet = await this.cryptoWalletService.getById(id);
    if (!cryptoWallet) {
      throw new CryptoWalletExceptions.WalletNotFound();
    }

    try {
      AccountAccessGuard.verifyAccess(cryptoWallet.account.id, session);
    } catch (e) {
      throw new CryptoWalletExceptions.WalletNotFound();
    }

    return await this.cryptoWalletService.update(id, payload);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseIntPipe()) id: number,
    @Session() session: IAccountSession,
  ) {
    const cryptoWallet = await this.cryptoWalletService.getById(id);
    if (!cryptoWallet) {
      throw new CryptoWalletExceptions.WalletNotFound();
    }

    try {
      AccountAccessGuard.verifyAccess(cryptoWallet.account.id, session);
    } catch (e) {
      throw new CryptoWalletExceptions.WalletNotFound();
    }

    await this.cryptoWalletService.delete(id);
  }
}