import { ForbiddenException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class IpAddressIsNotAllowedException extends ForbiddenException {
  constructor(ipAddress: string) {
    super([
      {
        code: CounterpartyExceptionsCodes.IpAddressIsNotAllowed,
        description: `IP address is not allowed: ${ipAddress}`,
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}