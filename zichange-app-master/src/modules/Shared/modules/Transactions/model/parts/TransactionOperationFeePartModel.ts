import { TransactionOperationDataPartModel } from './TransactionOperationDataPartModel';
import { IOutTransactionOperationFeePartDTO } from '../../abstract/dto/out.parts/IOutTransactionOperationFeePartDTO';
import { FeeType } from '../../../Fees/const/FeeType';
import { observable } from 'mobx';
import BigNumber from 'bignumber.js';

export class TransactionOperationFeePartModel
  extends TransactionOperationDataPartModel
  implements IOutTransactionOperationFeePartDTO
{
  @observable key: string;
  @observable type: FeeType;
  @observable value: BigNumber;

  toString(): string {
    if (!this.amount || this.amount.isNaN() || !this.amount.isPositive() || this.amount.isZero()) {
      return '';
    }
    return this.amount.toString();
  }

  static async create(DTO: IOutTransactionOperationFeePartDTO): Promise<TransactionOperationFeePartModel> {
    const base = await TransactionOperationDataPartModel.create(DTO);
    const model = new TransactionOperationFeePartModel();

    Object.assign(model, DTO);
    Object.assign(model, base);

    model.value = new BigNumber(DTO.value);

    return model;
  }
}