import { IOutTransactionEditPartDTO } from '../../abstract/dto/out.parts/IOutTransactionEditPartDTO';
import { observable } from 'mobx';

export class TransactionEditPartModel implements IOutTransactionEditPartDTO {
  @observable date: Date;
  @observable accountId: number;

  static async create(DTO: IOutTransactionEditPartDTO): Promise<TransactionEditPartModel> {
    const model = new TransactionEditPartModel();

    Object.assign(model, DTO);
    model.date = new Date(DTO.date);

    return model;
  }
}