import { IOutTransactionZichangeRequisitesDTO } from '../../abstract/dto/out.parts/IOutTransactionZichangeRequisitesDTO';
import { TransactionDepositMethodType } from '../../const/TransactionDepositMethodType';
import { observable } from 'mobx';

export class TransactionZichangeRequisitesModel implements IOutTransactionZichangeRequisitesDTO {
  @observable type: TransactionDepositMethodType;
  @observable data: any;

  static async create(DTO: IOutTransactionZichangeRequisitesDTO): Promise<TransactionZichangeRequisitesModel> {
    const model = new TransactionZichangeRequisitesModel();

    Object.assign(model, DTO);

    return model;
  }
}