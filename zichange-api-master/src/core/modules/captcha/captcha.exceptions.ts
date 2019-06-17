import { IExceptionMessage } from '../../errors/error.payload';
import { ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { captchaModuleName } from './const/captcha.module.name';

enum CaptchaExceptionsCodes {
  IncorrectCaptcha              = 1001,
  ReCaptchaApiNotRespond        = 1002,
  GeeTestCaptchaErrorInit       = 1003,
  GeeTestCaptchaInternalError   = 1004,
}

export namespace CaptchaExceptions {
  export class IncorrectCaptcha extends ForbiddenException {
    constructor() {
      super([
        {
          code: CaptchaExceptionsCodes.IncorrectCaptcha,
          description: 'Incorrect captcha',
          property: 'captcha',
          module: captchaModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class ReCaptchaApiNotRespond extends InternalServerErrorException {
    constructor() {
      super([
        {
          code: CaptchaExceptionsCodes.ReCaptchaApiNotRespond,
          description: 'Google ReCaptcha API not responding',
          property: 'captcha',
          module: captchaModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class GeeTestCaptchaErrorInit extends InternalServerErrorException {
    constructor() {
      super([
        {
          code: CaptchaExceptionsCodes.GeeTestCaptchaErrorInit,
          description: 'GeeTest captcha error init',
          module: captchaModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class GeeTestCaptchaInternalError extends InternalServerErrorException {
    constructor() {
      super([
        {
          code: CaptchaExceptionsCodes.GeeTestCaptchaInternalError,
          description: 'GeeTest captcha internal error',
          module: captchaModuleName,
        },
      ] as IExceptionMessage);
    }
  }
}