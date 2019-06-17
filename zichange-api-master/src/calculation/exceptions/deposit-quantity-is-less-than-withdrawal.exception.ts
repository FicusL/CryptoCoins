import { InternalServerErrorException } from '@nestjs/common';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { CalculationsExceptionsCodes } from '../const/calculations.exceptions-codes.enum';
import { calculationsModuleName } from '../const/calculations.module.name';

export class DepositQuantityIsLessThanWithdrawalException extends InternalServerErrorException {
  constructor() {
    super([
      {
        code: CalculationsExceptionsCodes.DepositQuantityIsLessThanWithdrawal,
        description: 'Deposit quantity is less than withdrawal',
        module: calculationsModuleName,
      },
    ] as IExceptionMessage);
  }
}