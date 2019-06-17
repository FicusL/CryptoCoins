import { Injectable } from '@nestjs/common';
import { ConfigsService } from '../../service/configs.service';
import { GeeTestCaptchaService } from './geetest/geetest.captcha.service';
import { RecaptchaCaptchaService } from './recaptcha/recaptcha.captcha.service';
import { CaptchaSystem } from '../../const/core.captcha.system.enum';

@Injectable()
export class CaptchaService {
  constructor(
    private readonly geeTestCaptchaService: GeeTestCaptchaService,
    private readonly recaptchaCaptchaService: RecaptchaCaptchaService,
  ) { }

  async verifyCaptcha(request, token: string) {
    if (!ConfigsService.isProduction) {
      return;
    }

    if (ConfigsService.captchaSystem === CaptchaSystem.GeeTest) {
      await this.geeTestCaptchaService.verifyCaptchaFromString(token);
    } else {
      await this.recaptchaCaptchaService.verifyCaptcha(request, token);
    }
  }
}