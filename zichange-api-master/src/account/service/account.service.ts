import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AccountEntity, loginByResetExpireTime, resetExpireTime } from '../entitiy/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from '../repository/account.repository';
import { InAccountDTO } from '../dto/in.account.dto';
import { OutAccountDTO } from '../dto/out.account.dto';
import { InAccountPasswordResetDTO } from '../dto/in.account.password.reset.dto';
import { IAccountSession } from '../abstract/account.session.interface';
import { Account2FAService } from './account.2fa.service';
import { AccountExceptions } from '../const/account.exceptions';
import { KycRepository } from '../../kyc/repository/kyc.repository';
import { InAccountRegisterDTO } from '../dto/in.account.register.dto';
import { OutAccountShortDto } from '../dto/out.account.short.dto';
import { OutAccountFullDto } from '../dto/out.account.full.dto';
import { BigNumber } from 'bignumber.js';
import { OutCurrencyBalanceDTO } from '../../transaction/dto/out.currency.balance.dto';
import { InviteCodesService } from './invite-codes.service';
import { InviteCodeEntity } from '../entitiy/invite-code.entity';
import { InviteCodesRepository } from '../repository/invite-codes.repository';
import { Connection } from 'typeorm';
import { CoreEmailService } from '../../core/modules/email/core.email.service';
import { EventBus } from '@nestjs/cqrs';
import { AccountCreateAccountEvent } from '../events/impl/account.create-account.event';
import { SettingsReferralService } from '../../settings/modules/referral/service/settings.referral.service';
import { AccountType } from '../const/account.type.enum';
import { ConfigsService } from '../../core/service/configs.service';
import { NotFoundCurrencyException } from '../../core/exceptions/not-found-currency.exception';
import { BalanceRepository } from '../../balance/service/balance.repository';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountRepository)
    private readonly accountRepository: AccountRepository,

    @InjectRepository(InviteCodesRepository)
    private readonly inviteCodesRepository: InviteCodesRepository,

    @InjectRepository(KycRepository)
    private readonly kycRepository: KycRepository,

    private readonly balanceRepository: BalanceRepository,

    private readonly dbConnection: Connection,

    private readonly account2FAService: Account2FAService,
    private readonly settingsReferralService: SettingsReferralService,

    private readonly emailService: CoreEmailService,

    protected readonly eventBus: EventBus,
  ) { }

  async getAccountsByIds(accountIds: number[]): Promise<AccountEntity[]> {
    return this.accountRepository.getAccountsByIds(accountIds);
  }

  async getAllUsersShort(): Promise<OutAccountShortDto[]>  {
    const [accounts, balances] = await Promise.all([
      this.accountRepository.getAllAccountsShort(),
      // this.transactionRepository.getBalanceForAllUsers(),
      new Map(),
    ]);

    return accounts.map(acc => {
      const accountBalanceMap = balances.get(acc.id) || new Map<string, BigNumber>();
      const accountBalance = OutCurrencyBalanceDTO.convertFromMap(accountBalanceMap);
      return new OutAccountShortDto(acc, accountBalance);
    });
  }

  async getAmountOfAccounts(): Promise<number> {
    return await this.accountRepository.getAmountOfAccounts();
  }

  async getAccountByCryptoWallet(cryptoWallet: string, inputCurrency: string) {
    const currency = inputCurrency.toUpperCase();

    if (currency === 'BTC') {
      return await this.getAccountByBtcWallet(cryptoWallet);
    } else if (currency === 'ETH') {
      return await this.getAccountByEthWallet(cryptoWallet);
    } else if (currency === 'LTC') {
      return await this.getAccountByLtcWallet(cryptoWallet);
    } else if (currency === 'ZCN') {
      return await this.getAccountByZcnWallet(cryptoWallet);
    }

    // TODO: add later other coins

    throw new NotFoundCurrencyException(currency);
  }

  async getAccountByBtcWallet(btcWalletAddress: string) {
    const account = await this.accountRepository.findByBtcWallet(btcWalletAddress);
    if (!account) {
      throw new AccountExceptions.AccountNotFound();
    }
    return account;
  }

  async getAccountByEthWallet(ethWalletAddress: string) {
    const account = await this.accountRepository.findByEthWallet(ethWalletAddress);
    if (!account) {
      throw new AccountExceptions.AccountNotFound();
    }
    return account;
  }

  async getAccountByZcnWallet(zcnWalletAddress: string) {
    const account = await this.accountRepository.findByZcnWallet(zcnWalletAddress);
    if (!account) {
      throw new AccountExceptions.AccountNotFound();
    }
    return account;
  }

  async getAccountByLtcWallet(ltcWalletAddress: string) {
    const account = await this.accountRepository.findByLtcWallet(ltcWalletAddress);
    if (!account) {
      throw new AccountExceptions.AccountNotFound();
    }
    return account;
  }

  async getAccountFullInfo(accountId: number) {
    const account = await this.accountRepository.getAccountFull(accountId);
    if (!account) {
      throw new AccountExceptions.AccountNotFound();
    }
    return account;
  }

  async getAccountFullInfoDTO(accountId: number): Promise<OutAccountFullDto> {
    const [account, balanceMap] = await Promise.all([
      this.getAccountFullInfo(accountId),
      this.balanceRepository.getCurrenciesBalances(accountId),
    ]);

    const accountBalance = OutCurrencyBalanceDTO.convertFromMap(balanceMap);
    return new OutAccountFullDto(account, accountBalance);
  }

  async getAllUsersFull(): Promise<OutAccountFullDto[]> {
    const [accounts, balances] = await Promise.all([
      this.accountRepository.getAllAccountsFull(),
      new Map(),
      // this.transactionRepository.getBalanceForAllUsers(),
    ]);

    return accounts.map(acc => {
      const accountBalanceMap = balances.get(acc.id) || new Map<string, BigNumber>();
      const accountBalance = OutCurrencyBalanceDTO.convertFromMap(accountBalanceMap);
      return new OutAccountFullDto(acc, accountBalance);
    });
  }

  async getAccountById(accountId: number): Promise<AccountEntity> {
    let account: AccountEntity | undefined;

    try {
      account = await this.accountRepository.findOne({
        id: accountId,
      });
    } catch (e) {
      throw new AccountExceptions.AccountNotFound();
    }

    if (!account) {
      throw new AccountExceptions.AccountNotFound();
    }

    return account;
  }

  async changeAccountRoles(account: AccountEntity, roles: { isAmlOfficer?: boolean; isTrader?: boolean }): Promise<AccountEntity> {
    let mustSave = false;

    if (typeof roles.isAmlOfficer === 'boolean') {
      if (account.isAmlOfficer !== roles.isAmlOfficer) {
        account.isAmlOfficer = roles.isAmlOfficer;

        mustSave = true;
      }
    }

    if (typeof roles.isTrader === 'boolean') {
      if (account.isTrader !== roles.isTrader) {
        account.isTrader = roles.isTrader;

        mustSave = true;
      }
    }

    if (mustSave) {
      return await this.accountRepository.save(account);
    }

    return account;
  }

  attachSessionToAccount(session: IAccountSession, account: AccountEntity): IAccountSession {
    session.accountId = account.id;
    session.isAuthorized = session.isAuthorized || !account.twoFaEnabled;
    session.isActivated = account.isActivated;
    session.isAdmin = account.isAdmin;
    session.isTrader = account.isTrader;
    session.isAmlOfficer = account.isAmlOfficer;
    session.isPartner = account.isPartner;
    session.isCounterparty = account.isCounterparty;

    return session;
  }

  async findAccountByEmail(email: string) {
    const account = await this.accountRepository.findByEmail(email);
    if (!account) {
      throw new AccountExceptions.EmailNotFound();
    }
    return account;
  }

  async login(data: InAccountDTO) {
    let account: AccountEntity | undefined;
    try {
      account = await this.accountRepository.findByEmail(data.email);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    if (!account || !account.isPasswordValid(data.password)) {
      throw new AccountExceptions.NoEmailPasswordMatches();
    }

    if (account.isBlocked) {
      throw new AccountExceptions.AccountIsBlocked(account.blockingReason);
    }

    return account;
  }

  async getApprovedAccounts(): Promise<AccountEntity[]> {
    return await this.accountRepository.getApprovedAccounts();
  }

  async getApprovedAccountsAddresses() {
    return await this.accountRepository.getApprovedAccountsAddresses();
  }

  async register(payload: InAccountRegisterDTO) {
    const account = await this.accountRepository.findByEmail(payload.email);

    if (!account) {
      return await this.registerWithParams({
        email: payload.email,
        type: payload.type,
        password: payload.password,
        invite_code: payload.invite_code,
        referralToken: payload.referralToken,
        sendActivation: true,
        mustRegister: false,
      });
    }

    if (account.mustRegister) {
      return await this.registerWithParams({
        email: account.email,
        type: account.type,
        password: payload.password,
        invite_code: payload.invite_code,
        referralToken: account.referralToken,
        sendActivation: true,
        mustRegister: false,
      }, account);
    }

    throw new AccountExceptions.EmailAlreadyRegistered();
  }

  async registerWithParams(payload: IRegisterPayload, existedAccount?: AccountEntity) {
    let inviteCode = await this.findInviteCode(payload.invite_code);

    let account = existedAccount ? existedAccount : new AccountEntity();

    account.password = payload.password;
    account.mustRegister = payload.mustRegister;

    if (!existedAccount) {
      account.email = payload.email;
      account.type = payload.type;
      account.activationToken = account.generateActivationToken();
      account.isPartner = true;
      account.referralToken = account.generateReferralToken();
      const referralOptions = await this.settingsReferralService.get();
      account.exchangeCommissionCoefficient = referralOptions.exchangeCommissionCoefficient;
    }

    const queryRunner = this.dbConnection.createQueryRunner();
    await queryRunner.startTransaction('SERIALIZABLE');

    account = await queryRunner.manager.save(account);

    if (InviteCodesService.IS_ENABLED) {
      if (!inviteCode || !inviteCode.isFree) {
        throw new AccountExceptions.IncorrectInviteCode();
      }

      inviteCode.account = account;
      inviteCode = await queryRunner.manager.save(inviteCode);
    }

    try {
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new InternalServerErrorException();
    }

    this.eventBus.publish(new AccountCreateAccountEvent(account));

    if (payload.sendActivation) {
      await this.sendActivation(account);
    }

    return account;
  }

  protected async findInviteCode(invite_code: string | undefined) {
    let inviteCode: InviteCodeEntity | undefined;

    if (InviteCodesService.IS_ENABLED) {
      try {
        inviteCode = await this.inviteCodesRepository.findOne(invite_code);
      } catch (e) {
        throw new AccountExceptions.IncorrectInviteCode();
      }

      if (!inviteCode || !inviteCode.isFree) {
        throw new AccountExceptions.IncorrectInviteCode();
      }
    }

    return inviteCode;
  }

  async updatePassword(account: AccountEntity, oldPassword: string, newPassword: string, code?: string) {
    await this.account2FAService.verify2FA(account, code);

    const isOldPasswordValid = account.isPasswordValid(oldPassword);
    if (!isOldPasswordValid) {
      throw new AccountExceptions.IncorrectOldPassword();
    }

    if (oldPassword === newPassword) {
      throw new AccountExceptions.EqualPasswords();
    }

    account.password = newPassword;

    try {
      await this.accountRepository.save(account);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return true;
  }

  async requestResetPassword(payload: InAccountPasswordResetDTO) {
    let account: AccountEntity | undefined;
    try {
      account = await this.accountRepository.findByEmail(payload.email);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    if (!account) {
      throw new AccountExceptions.EmailNotFound();
    }

    account.resetToken = account.generatePasswordResetToken();
    account.resetTokenExpiration = new Date(new Date().getTime() + resetExpireTime);

    try {
      await this.emailService.send({
        subject: 'ZiChange reset password',
        to: account.email,
      }, 'reset-password', {
        link: `${ConfigsService.domainFrontEnd}/reset_password/${account.resetToken}`,
        shortLink: `${ConfigsService.domainFrontEnd}/reset_password/`,
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }

    try {
      await this.accountRepository.save(account);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getResetPasswordTokenData(token: string) {
    let account: AccountEntity | undefined;
    try {
      account = await this.accountRepository.findByResetToken(token);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    if (!account) {
      throw new AccountExceptions.ResetTokenIncorrect();
    }

    return account;
  }

  protected async saveAccount(account: AccountEntity) {
    try {
      return  this.accountRepository.save(account);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async loginByResetToken(token: string) {
    let account: AccountEntity | undefined;
    try {
      account = await this.accountRepository.findByResetTokenForLogin(token);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    if (!account) {
      throw new AccountExceptions.ResetTokenIncorrect();
    }

    account.resetToken = null as any;
    account.loginByResetTokenExpiration = new Date(0);

    return await this.saveAccount(account);
  }

  async resetPasswordFinish(token: string, password: string) {
    let account: AccountEntity | undefined;
    try {
      account = await this.accountRepository.findByResetToken(token);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    if (!account) {
      throw new AccountExceptions.ResetTokenIncorrect();
    }

    account.password = password;
    account.resetTokenExpiration = new Date(0);
    account.loginByResetTokenExpiration = new Date(new Date().getTime() + loginByResetExpireTime);

    await this.saveAccount(account);
  }

  async sendActivation(account: AccountEntity) {
    if (account.isActivated) {
      throw new AccountExceptions.AccountAlreadyActivated();
    }

    try {
      await this.emailService.send({
        subject: 'ZiChange account activation',
        to: account.email,
      }, 'activation', {
        link: `${ConfigsService.domainFrontEnd}/verify_email/${account.activationToken}`,
        shortLink: `${ConfigsService.domainFrontEnd}/verify_email/`,
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return true;
  }

  async activate(token: string) {
    let account: AccountEntity | undefined;
    try {
      account = await this.accountRepository.findByActivationToken(token);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    if (!account) {
      throw new AccountExceptions.ActivationTokenIncorrect();
    }

    account.isActivated = true;

    try {
      account = await this.accountRepository.save(account);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return account;
  }

  async getAccountData(account: AccountEntity): Promise<OutAccountDTO> {
    const kyc = await this.kycRepository.findByAccount(account);
    return new OutAccountDTO(account, kyc);
  }

  async refreshSession(session: IAccountSession) {
    if (!session || !session.accountId) {
      return session;
    }

    const account = await this.accountRepository.findOneOrFail(session.accountId);
    return this.attachSessionToAccount(session, account);
  }
}

interface IRegisterPayload {
  email: string;
  type: AccountType;
  password: string;
  invite_code?: string;
  referralToken?: string;
  sendActivation: boolean;
  mustRegister: boolean;
}