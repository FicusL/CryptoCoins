import { TransactionOperationDataPartModel } from './TransactionOperationDataPartModel';
import { TransactionOperationFeePartModel } from './TransactionOperationFeePartModel';
import { IOutTransactionExchangePartDTO } from '../../abstract/dto/out.parts/IOutTransactionExchangePartDTO';
import { observable } from 'mobx';
import BigNumber from 'bignumber.js';

export class TransactionExchangePartModel implements IOutTransactionExchangePartDTO {
  @observable from: TransactionOperationDataPartModel;
  @observable to: TransactionOperationDataPartModel;
  @observable fee: TransactionOperationFeePartModel;
  @observable rate?: BigNumber;

  static async create(DTO: IOutTransactionExchangePartDTO): Promise<TransactionExchangePartModel> {
    const model = new TransactionExchangePartModel();

    model.from = await TransactionOperationDataPartModel.create(DTO.from);
    model.to = await TransactionOperationDataPartModel.create(DTO.to);
    model.fee = await TransactionOperationFeePartModel.create(DTO.fee);
    model.rate = new BigNumber(DTO.rate);

    return model;
  }
}
