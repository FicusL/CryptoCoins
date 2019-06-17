import * as QRCode from 'qrcode';
import { IOutTransactionDepositPartDTO } from '../../abstract/dto/out.parts/IOutTransactionDepositPartDTO';
import { TransactionOperationDataPartModel } from './TransactionOperationDataPartModel';
import { TransactionDepositMethodModel } from './TransactionDepositMethodModel';
import { TransactionZichangeRequisitesModel } from './TransactionZichangeRequisitesModel';
import { TransactionOperationFeePartModel } from './TransactionOperationFeePartModel';
import { observable } from 'mobx';
import { BigNumber } from 'bignumber.js';
import { TransactionDepositMethodType } from '../../const/TransactionDepositMethodType';
import { ICryptoWalletZichangeRequisitesData } from '../../abstract/ITransactionZichangeRequisites';

export class TransactionDepositPartModel
  extends TransactionOperationDataPartModel
  implements IOutTransactionDepositPartDTO
{
  @observable method: TransactionDepositMethodModel;
  @observable zichangeRequisites: TransactionZichangeRequisitesModel;
  @observable paid: boolean;
  @observable externalEUREquivalent: BigNumber;
  @observable fee: TransactionOperationFeePartModel;

  @observable zichangeRequisitesQRCode: string | undefined;

  static async create(DTO: IOutTransactionDepositPartDTO): Promise<TransactionDepositPartModel> {
    const base = await TransactionOperationDataPartModel.create(DTO);
    const model = new TransactionDepositPartModel();

    Object.assign(model, DTO);
    Object.assign(model, base);

    model.method = await TransactionDepositMethodModel.create(DTO.method);
    model.zichangeRequisites = await TransactionZichangeRequisitesModel.create(DTO.zichangeRequisites);
    model.externalEUREquivalent = new BigNumber(DTO.externalEUREquivalent);
    model.fee = await TransactionOperationFeePartModel.create(DTO.fee);

    const isCryptoWallet = model.zichangeRequisites
      && model.zichangeRequisites.type === TransactionDepositMethodType.CryptoWallet;

    if (isCryptoWallet) {
      const walletAddress = (model.zichangeRequisites.data as ICryptoWalletZichangeRequisitesData).address;

      model.zichangeRequisitesQRCode = await QRCode.toDataURL(walletAddress,
        { errorCorrectionLevel: 'H' },
      );
    }

    return model;
  }
}