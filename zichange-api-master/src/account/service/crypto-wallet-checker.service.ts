import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CryptoWalletGeneratorBase } from '../abstract/crypto-wallet-generator.base.service';
import { waitMiliseconds } from '../../core/util/wait-ms';
import { AccountRepository } from '../repository/account.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '../entitiy/account.entity';
import { CoreEmailService } from '../../core/modules/email/core.email.service';
import { CryptoCoin } from '../../core/const/coins';
import { ICryptoAddresses } from '../abstract/crypto-addresses.interface';

@Injectable()
export class CryptoWalletCheckerService implements OnApplicationBootstrap {
  constructor(
    private readonly cryptoWalletGeneratorBase: CryptoWalletGeneratorBase,
    private readonly emailService: CoreEmailService,

    @InjectRepository(AccountRepository)
    private readonly accountRepository: AccountRepository,
  ) { }

  onApplicationBootstrap() {
    this.startLoop();
  }

  protected async startLoop() {
    while (true) {

      try {
        const accounts = await this.accountRepository.findAccountsWithoutCryptoWalletsAndWithApprovedKyc();

        for (const account of accounts) {
          await this.processAccount(account);
          await waitMiliseconds(5 * 1000);
        }

      } catch (e) {
        Logger.error(e.message, undefined, CryptoWalletCheckerService.name);
      }

      await waitMiliseconds(2 * 60 * 1000);
    }
  }

  protected async processAccount(account: AccountEntity) {
    account = await this.generateCryptoWallets(account);
    account = await this.checkEthAddress(account);

    await this.sendEmailAboutAccountIsReady(account);
  }

  protected getCoinsForGenerating(account: AccountEntity) {
    const coins: CryptoCoin[] = [];

    if (!account.btcWalletAddress) {
      coins.push(CryptoCoin.BTC);
    }
    if (!account.ethWalletAddress && !account.ethWalletAddressBitGoIndex) {
      coins.push(CryptoCoin.ETH);
    }
    if (!account.ltcWalletAddress) {
      coins.push(CryptoCoin.LTC);
    }
    if (!account.zcnWalletAddress) {
      coins.push(CryptoCoin.ZCN);
    }

    // TODO: use later (uncomment)
    // if (!account.xrpWalletAddress) {
    //   coins.push(CryptoCoin.XRP);
    // }
    // if (!account.bchWalletAddress) {
    //   coins.push(CryptoCoin.BCH);
    // }
    // if (!account.xlmWalletAddress) {
    //   coins.push(CryptoCoin.XLM);
    // }
    // if (!account.dashWalletAddress) {
    //   coins.push(CryptoCoin.DASH);
    // }
    // if (!account.zecWalletAddress) {
    //   coins.push(CryptoCoin.ZEC);
    // }
    // if (!account.bsvWalletAddress) {
    //   coins.push(CryptoCoin.BSV);
    // }
    // if (!account.btgWalletAddress) {
    //   coins.push(CryptoCoin.BTG);
    // }

    return coins;
  }

  protected async fillAddressesToAccount(account: AccountEntity, wallets: ICryptoAddresses): Promise<AccountEntity> {
    if (wallets.BTC) {
      account.btcWalletAddress = wallets.BTC;
    }
    if (wallets.ETH) {
      account.ethWalletAddressBitGoIndex = wallets.ETH.index;
    }
    if (wallets.LTC) {
      account.ltcWalletAddress = wallets.LTC;
    }
    if (wallets.ZCN) {
      account.zcnWalletAddress = wallets.ZCN;
    }

    if (wallets.XRP) {
      account.xrpWalletAddress = wallets.XRP;
    }
    if (wallets.BCH) {
      account.bchWalletAddress = wallets.BCH;
    }
    if (wallets.XLM) {
      account.xlmWalletAddress = wallets.XLM;
    }
    if (wallets.DASH) {
      account.dashWalletAddress = wallets.DASH;
    }
    if (wallets.ZEC) {
      account.zecWalletAddress = wallets.ZEC;
    }
    if (wallets.BSV) {
      account.bsvWalletAddress = wallets.BSV;
    }
    if (wallets.BTG) {
      account.btgWalletAddress = wallets.BTG;
    }

    return await this.accountRepository.save(account);
  }

  protected async generateCryptoWallets(account: AccountEntity): Promise<AccountEntity> {
    const coins = this.getCoinsForGenerating(account);
    const wallets = await this.cryptoWalletGeneratorBase.generateAddresses(account.email, coins);
    return await this.fillAddressesToAccount(account, wallets);
  }

  protected async checkEthAddress(account: AccountEntity): Promise<AccountEntity> {
    if (account.ethWalletAddress || typeof account.ethWalletAddressBitGoIndex !== 'number') {
      return account;
    }

    const address = await this.cryptoWalletGeneratorBase.getEthAddress(account.ethWalletAddressBitGoIndex, account.email);
    if (!address) {
      return account;
    }

    account.ethWalletAddress = address;
    return await this.accountRepository.save(account);
  }

  protected async sendEmailAboutAccountIsReady(account: AccountEntity) {
    const mustSend =
      account.btcWalletAddress &&
      account.ethWalletAddress &&
      account.ltcWalletAddress &&
      account.zcnWalletAddress;

    // TODO: use later (uncomment)
    // const mustSend =
    //   account.btcWalletAddress &&
    //   account.ethWalletAddress &&
    //   account.ltcWalletAddress &&
    //   account.zcnWalletAddress &&
    //   account.xrpWalletAddress &&
    //   account.bchWalletAddress &&
    //   account.xlmWalletAddress &&
    //   account.dashWalletAddress &&
    //   account.zecWalletAddress &&
    //   account.bsvWalletAddress &&
    //   account.btgWalletAddress;

    if (!mustSend) {
      return;
    }

    await this.emailService.send({
      subject: 'ZiChange account is ready to use',
      to: account.email,
    });
  }
}