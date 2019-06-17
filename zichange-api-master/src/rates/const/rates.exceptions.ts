import { IExceptionMessage } from '../../core/errors/error.payload';
import { InternalServerErrorException } from '@nestjs/common';
import { ratesModuleName } from './rates.module.name';

enum RatesExceptionsCodes {
  CannotBeObtainedEurEquivalent = 0,
  RateCanNotBeCalculated        = 1,
}

export namespace RatesExceptions {
  export class CannotBeObtainedEurEquivalent extends InternalServerErrorException {
    constructor() {
      super([
        {
          code: RatesExceptionsCodes.CannotBeObtainedEurEquivalent,
          description: 'Cannot be obtained EUR equivalent',
          module: ratesModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class RateCanNotBeCalculated extends InternalServerErrorException {
    constructor() {
      super([
        {
          code: RatesExceptionsCodes.RateCanNotBeCalculated,
          description: 'Rate can not be calculated',
          module: ratesModuleName,
        },
      ] as IExceptionMessage);
    }
  }
}
