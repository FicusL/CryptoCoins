import { Injectable } from '@nestjs/common';
import { CurrencyPairEntity } from '../../src/transaction/entity/currency-pair.entity';
import { CounterpartyApiKeyRepository } from '../../src/counterparty/repository/counterparty.api-key.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyPairRepository } from '../../src/transaction/repository/currency-pair.repository';
import * as crypto from 'crypto';

export interface IGenerateSignature {
  publicKey: string;
  secretKey: string;
  nonce: string;
  encodeParams: string;
  endpoint: string;
}

@Injectable()
export class B2bHelperService {
  constructor(
    @InjectRepository(CounterpartyApiKeyRepository)
    protected readonly counterpartyApiKeyRepository: CounterpartyApiKeyRepository,

    @InjectRepository(CurrencyPairRepository)
    protected readonly currencyPairRepository: CurrencyPairRepository,
  ) { }

  async createPair(): Promise<CurrencyPairEntity> {
    const first = new CurrencyPairEntity();

    first.active = true;
    first.currencySell = 'EUR';
    first.currencyBuy = 'BTC';

    return await this.currencyPairRepository.save(first);
  }

  protected generateHmac(key: string, message: string): string {
    return crypto.createHmac('sha256', key).update(message).digest('hex');
  }
  
  generateSignature(data: IGenerateSignature) {
    const message = `${data.nonce}${data.publicKey}${data.endpoint}${data.encodeParams}`;
    const signature = this.generateHmac(data.secretKey, message);
    return signature.toUpperCase();
  }
}