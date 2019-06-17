import { IOutTransactionOperationDataPartDTO } from '../../abstract/dto/out.parts/IOutTransactionOperationDataPartDTO';
import { observable } from 'mobx';
import BigNumber from 'bignumber.js';

export class TransactionOperationDataPartModel implements IOutTransactionOperationDataPartDTO {
  @observable currency: string;
  @observable amount: BigNumber;

  static async create(DTO: IOutTransactionOperationDataPartDTO): Promise<TransactionOperationDataPartModel> {
    const model = new TransactionOperationDataPartModel();

    Object.assign(model, DTO);
    model.amount = new BigNumber(DTO.amount);

    return model;
  }
}