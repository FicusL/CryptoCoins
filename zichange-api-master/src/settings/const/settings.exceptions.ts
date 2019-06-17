import { InternalServerErrorException } from '@nestjs/common';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { settingsModuleName } from './settings.module.name';

enum SettingsExceptionsCodes {
  UnknownError             = 0,
}

export namespace SettingsExceptions {
  export class UnknownError extends InternalServerErrorException {
    constructor() {
      super([
        {
          code: SettingsExceptionsCodes.UnknownError,
          description: 'Unknown error',
          module: settingsModuleName,
        },
      ] as IExceptionMessage);
    }
  }
}