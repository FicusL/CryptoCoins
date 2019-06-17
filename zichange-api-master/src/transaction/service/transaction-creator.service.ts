import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { ITransactionCreate } from '../abstract/operations/transaction.create.interface';
import { TransactionDepositEmbedded } from '../entity/embedded/transaction-parts/transaction.deposit.embedded';
import { TransactionExchangeEmbedded } from '../entity/embedded/transaction-parts/transaction.exchange.embedded';
import { BigNumber } from 'bignumber.js';
import { TransactionWithdrawalEmbedded } from '../entity/embedded/transaction-parts/transaction.withdrawal.embedded';
import { TransactionEntity } from '../entity/transaction.entity';
import { TransactionType } from '../const/transaction.type.enum';
import { TransactionHTTPExceptions } from '../const/transaction.http.exceptions';
import { TransactionStatus } from '../const/transaction.status.enum';
import { TransactionCreationEmbedded } from '../entity/embedded/transaction.creation.embedded';
import { TransactionLastEditEmbedded } from '../entity/embedded/transaction.last-edit.embedded';
import { TransactionAddTransactionEvent } from '../events/impl/transaction.add-transaction.event';
import { EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from '../repository/transaction.repository';
import { TransactionDepositPartService } from './transaction-parts/transaction.deposit-part.service';
import { TransactionExchangePartService } from './transaction-parts/transaction.exchange-part.service';
import { TransactionWithdrawalPartService } from './transaction-parts/transaction.withdrawal-part.service';
import { AccountService } from '../../account/service/account.service';
import { RatesServiceProviderBase } from '../../rates/service/rates.service.provider.base';
import { TransactionAddressesValidatorService } from './addresses-validator/transaction.addresses-validator.service';

@Injectable()
export class TransactionCreatorService {
  constructor(
    private readonly eventBus: EventBus,

    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,

    private readonly transactionDepositPartService: TransactionDepositPartService,
    private readonly transactionExchangePartService: TransactionExchangePartService,
    private readonly transactionWithdrawalPartService: TransactionWithdrawalPartService,

    private readonly accountService: AccountService,
    private readonly exchangeService: RatesServiceProviderBase,
    private readonly transactionAddressesValidatorService: TransactionAddressesValidatorService,
  ) { }

  // region Public methods

  async createTransaction(accountId: number, params: ITransactionCreate, dryRun = false): Promise<TransactionEntity> {
    const account = await this.accountService.getAccountById(accountId);

    const transactionPartsFactoryMethods = {
      [TransactionType.Deposit]: this.createDepositTransactionParts.bind(this),
      [TransactionType.Withdrawal]: this.createWithdrawalTransactionParts.bind(this),
      [TransactionType.Exchange]: this.createExchangeTransactionParts.bind(this),
      [TransactionType.ExchangeWithdrawal]: this.createExchangeWithdrawalTransactionParts.bind(this),
      [TransactionType.DepositExchange]: this.createDepositExchangeTransactionParts.bind(this),
      [TransactionType.DepositExchangeWithdrawal]: this.createDepositExchangeWithdrawalTransactionParts.bind(this),
      [TransactionType.BuyBasket]: this.createExchangeTransactionParts.bind(this),
      [TransactionType.SellBasket]: this.createExchangeTransactionParts.bind(this),
    };

    const factoryMethod = transactionPartsFactoryMethods[params.type];
    if (!factoryMethod) {
      throw new TransactionHTTPExceptions.NotRealizedTransactionType();
    }

    const internalTransaction = !params.counterparty;
    const options: ICreateTransactionOptions = {
      verify2FA: internalTransaction,
      isB2BTransaction: !internalTransaction,
    };

    let counterpartyFeeEUREquivalent = new BigNumber(0);
    if (params.counterpartyPair && params.counterpartyFee) {
      const currencySell = params.counterpartyPair.currencySell;
      counterpartyFeeEUREquivalent = this.exchangeService.getEUREquivalent(currencySell, new BigNumber(params.counterpartyFee));
    }

    if (typeof params.counterpartyWallet === 'string' && params.counterpartyPair) {
      this.transactionAddressesValidatorService.validateAddress(params.counterpartyWallet, params.counterpartyPair.currencyBuy);
    }

    const parts = await factoryMethod(account, params, options);
    let transaction = new TransactionEntity({
      type: params.type,
      status: params.status || TransactionStatus.Pending,
      creation: new TransactionCreationEmbedded({ creationAccount: account, date: new Date() }),
      edit: new TransactionLastEditEmbedded({ date: new Date(0) }),
      account,

      // @ts-ignore
      deposit: parts.deposit,

      // @ts-ignore
      exchange: parts.exchange,

      // @ts-ignore
      withdrawal: parts.withdrawal,

      counterparty: params.counterparty,
      counterpartyActivationToken: params.counterpartyActivationToken,
      counterpartyPair: params.counterpartyPair,
      counterpartyAmount: new BigNumber(params.counterpartyAmount || 0),
      counterpartyFee: new BigNumber(params.counterpartyFee || 0),
      counterpartyFeeEUREquivalent,
      counterpartyWallet: params.counterpartyWallet,
    });

    if (!dryRun) {
      try {
        transaction = await this.transactionRepository.correctSave(transaction);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }

    this.eventBus.publish(new TransactionAddTransactionEvent({
      account,
      transaction,
      pushToRedis: true,
    }));

    return transaction;
  }

  // endregion

  // region Private methods

  private async createDepositTransactionParts(account: AccountEntity, params: ITransactionCreate, options: ICreateTransactionOptions):
    Promise<{ deposit: TransactionDepositEmbedded }>
  {
    if (!params.deposit) {
      throw new InternalServerErrorException();
    }

    const deposit = await this.transactionDepositPartService.createDepositTransactionPart(account, params.deposit, {
      isB2BTransaction: options.isB2BTransaction,
    });

    return { deposit };
  }

  private async createExchangeTransactionParts(account: AccountEntity, params: ITransactionCreate, options: ICreateTransactionOptions):
    Promise<{ exchange: TransactionExchangeEmbedded }>
  {
    if (!params.exchange) {
      throw new InternalServerErrorException();
    }

    const exchange = await this.transactionExchangePartService.createExchangeTransactionPart(account, params.type, params.exchange, {
      counterpartyFee: new BigNumber(params.counterpartyFee || 0),
      balanceCorrection: undefined,
      isB2BTransaction: options.isB2BTransaction,
    });
    return { exchange };
  }

  private async createWithdrawalTransactionParts(account: AccountEntity, params: ITransactionCreate, options: ICreateTransactionOptions):
    Promise<{ withdrawal: TransactionWithdrawalEmbedded }>
  {
    if (!params.withdrawal) {
      throw new InternalServerErrorException();
    }

    const withdrawal = await this.transactionWithdrawalPartService.createWithdrawalTransactionPart(account, params.withdrawal, {
      verify2FA: options.verify2FA,
      isB2BTransaction: options.isB2BTransaction,
    });
    return { withdrawal };
  }

  private async createDepositExchangeTransactionParts(
    account: AccountEntity,
    params: ITransactionCreate,
    options: ICreateTransactionOptions,
  ): Promise<{ deposit: TransactionDepositEmbedded, exchange: TransactionExchangeEmbedded }> {
    if (!params.deposit || !params.exchange) {
      throw new InternalServerErrorException();
    }

    const deposit = await this.transactionDepositPartService.createDepositTransactionPart(account, params.deposit, {
      isB2BTransaction: options.isB2BTransaction,
    });

    params.exchange.from.amount = deposit.amount.minus(deposit.fee.amount);

    const exchange = await this.transactionExchangePartService.createExchangeTransactionPart(account, params.type, params.exchange, {
      counterpartyFee: new BigNumber(params.counterpartyFee || 0),
      balanceCorrection: deposit.amount.minus(deposit.fee.amount),
      isB2BTransaction: options.isB2BTransaction,
    });

    return { deposit,  exchange };
  }

  private async createDepositExchangeWithdrawalTransactionParts(
    account: AccountEntity,
    params: ITransactionCreate,
    options: ICreateTransactionOptions,
  ): Promise<{ deposit: TransactionDepositEmbedded, exchange: TransactionExchangeEmbedded, withdrawal: TransactionWithdrawalEmbedded }> {
    if (!params.deposit || !params.exchange || !params.withdrawal) {
      throw new InternalServerErrorException();
    }

    const deposit = await this.transactionDepositPartService.createDepositTransactionPart(account, params.deposit, {
      isB2BTransaction: options.isB2BTransaction,
    });

    params.exchange.from.amount = deposit.amount.minus(deposit.fee.amount);

    const exchange = await this.transactionExchangePartService.createExchangeTransactionPart(account, params.type, params.exchange, {
      counterpartyFee: new BigNumber(params.counterpartyFee || 0),
      balanceCorrection: deposit.amount.minus(deposit.fee.amount),
      isB2BTransaction: options.isB2BTransaction,
    });

    const { amount: toAmount, currency: toCurrency } = exchange.to;

    const withdrawal = await this.transactionWithdrawalPartService.createWithdrawalTransactionPart(account, {
      ...params.withdrawal,

      amount: toAmount,
      currency: toCurrency,
    }, {
      balanceCorrection: toAmount,
      verify2FA: options.verify2FA,
      isB2BTransaction: options.isB2BTransaction,
    });

    return { deposit, exchange, withdrawal };
  }

  private async createExchangeWithdrawalTransactionParts(account: AccountEntity, params: ITransactionCreate, options: ICreateTransactionOptions):
    Promise<{ exchange: TransactionExchangeEmbedded, withdrawal: TransactionWithdrawalEmbedded }>
  {
    if (!params.exchange || !params.withdrawal) {
      throw new InternalServerErrorException();
    }

    const exchange = await this.transactionExchangePartService.createExchangeTransactionPart(account, params.type, params.exchange, {
      counterpartyFee: new BigNumber(params.counterpartyFee || 0),
      balanceCorrection: undefined,
      isB2BTransaction: options.isB2BTransaction,
    });

    const { amount: toAmount, currency: toCurrency } = exchange.to;

    const withdrawal = await this.transactionWithdrawalPartService.createWithdrawalTransactionPart(account, {
      ...params.withdrawal,

      amount: toAmount,
      currency: toCurrency,
    }, {
      balanceCorrection: toAmount,
      verify2FA: options.verify2FA,
      isB2BTransaction: options.isB2BTransaction,
    });

    return { exchange, withdrawal };
  }

  // endregion
}

interface ICreateTransactionOptions {
  verify2FA: boolean;
  isB2BTransaction: boolean;
}