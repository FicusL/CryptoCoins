import { TransactionOperationFeePartModel } from './TransactionOperationFeePartModel';
import { TransactionWithdrawalMethodModel } from './TransactionWithdrawalMethodModel';
import { TransactionOperationDataPartModel } from './TransactionOperationDataPartModel';
import { IOutTransactionWithdrawalPartDTO } from '../../abstract/dto/out.parts/IOutTransactionWithdrawalPartDTO';
import { observable } from 'mobx';
import BigNumber from 'bignumber.js';

export class TransactionWithdrawalPartModel
  extends TransactionOperationDataPartModel
  implements IOutTransactionWithdrawalPartDTO
{
  @observable method: TransactionWithdrawalMethodModel;
  @observable externalEUREquivalent: BigNumber;
  @observable fee: TransactionOperationFeePartModel;

  static async create(DTO: IOutTransactionWithdrawalPartDTO): Promise<TransactionWithdrawalPartModel> {
    const base = await TransactionOperationDataPartModel.create(DTO);
    const model = new TransactionWithdrawalPartModel();

    Object.assign(model, DTO);
    Object.assign(model, base);

    model.method = await TransactionWithdrawalMethodModel.create(DTO.method);
    model.externalEUREquivalent = new BigNumber(DTO.externalEUREquivalent);
    model.fee = await TransactionOperationFeePartModel.create(DTO.fee);

    return model;
  }
}