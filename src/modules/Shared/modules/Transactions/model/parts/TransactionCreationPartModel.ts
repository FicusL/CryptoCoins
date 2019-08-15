import { IOutTransactionCreationPartDTO } from '../../abstract/dto/out.parts/IOutTransactionCreationPartDTO';
import { observable } from 'mobx';

export class TransactionCreationPartModel implements IOutTransactionCreationPartDTO {
  @observable date: Date;
  @observable accountId: number;

  static async create(DTO: IOutTransactionCreationPartDTO): Promise<TransactionCreationPartModel> {
    const model = new TransactionCreationPartModel();

    Object.assign(model, DTO);
    model.date = new Date(DTO.date);

    return model;
  }
}