import { IOutTransactionWithdrawalMethodDTO } from '../../abstract/dto/out.parts/IOutTransactionWithdrawalMethodDTO';
import { TransactionWithdrawalMethodType } from '../../const/TransactionWithdrawalMethodType';
import { observable } from 'mobx';

export class TransactionWithdrawalMethodModel implements IOutTransactionWithdrawalMethodDTO {
  @observable type: TransactionWithdrawalMethodType;
  @observable data: any;

  static async create(DTO: IOutTransactionWithdrawalMethodDTO): Promise<TransactionWithdrawalMethodModel> {
    const model = new TransactionWithdrawalMethodModel();
    Object.assign(model, DTO);
    return model;
  }
}