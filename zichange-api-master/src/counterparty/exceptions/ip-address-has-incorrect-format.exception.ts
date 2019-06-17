import { BadRequestException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class IpAddressHasIncorrectFormatException extends BadRequestException {
  constructor() {
    super([
      {
        code: CounterpartyExceptionsCodes.IpAddressHasIncorrectFormat,
        description: 'IP address has incorrect format',
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}