import { Injectable } from '@nestjs/common';
import { TransactionHTTPExceptions } from '../../const/transaction.http.exceptions';
import * as Validator from 'wallet-address-validator';

@Injectable()
export class TransactionAddressesValidatorService {
  validateAddress(address: string, currency: string): void {
    const record: Record<string, (address: string) => boolean> = {
      BTC: this.btcCorrect.bind(this),
      ETH: this.ethCorrect.bind(this),
      LTC: this.ltcCorrect.bind(this),
      ZCN: this.ethCorrect.bind(this),
    };

    const handler = record[currency.toUpperCase()];
    if (!handler) {
      throw new TransactionHTTPExceptions.NotFoundCurrency(currency);
    }

    const valid = handler(address);
    if (!valid) {
      throw new TransactionHTTPExceptions.BadCryptoAddress(address, currency);
    }
  }

  protected btcCorrect(address: string): boolean {
    return Validator.validate(address, 'BTC');
  }

  protected ethCorrect(address: string): boolean {
    return Validator.validate(address, 'ETH');
  }

  protected ltcCorrect(address: string): boolean {
    return Validator.validate(address, 'LTC');
  }
}