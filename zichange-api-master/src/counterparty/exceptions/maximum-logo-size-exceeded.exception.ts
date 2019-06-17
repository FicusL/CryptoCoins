import { BadRequestException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class MaximumLogoSizeExceededException extends BadRequestException {
  constructor(maxSizeMb: number) {
    super([
      {
        code: CounterpartyExceptionsCodes.MaximumLogoSizeExceeded,
        description: `Maximum logo size exceeded. Max logo size: ${maxSizeMb} Mb`,
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}