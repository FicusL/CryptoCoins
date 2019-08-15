import { IOutTransactionDepositMethodDTO } from '../../abstract/dto/out.parts/IOutTransactionDepositMethodDTO';
import { TransactionDepositMethodType } from '../../const/TransactionDepositMethodType';
import { observable } from 'mobx';

export class TransactionDepositMethodModel implements IOutTransactionDepositMethodDTO {
  @observable type: TransactionDepositMethodType;

  static async create(DTO: IOutTransactionDepositMethodDTO): Promise<TransactionDepositMethodModel> {
    const model = new TransactionDepositMethodModel();

    Object.assign(model, DTO);

    return model;
  }
}