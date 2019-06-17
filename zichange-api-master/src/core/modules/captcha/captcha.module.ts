import { Module } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { CaptchaController } from './captcha.controller';
import { GeeTestCaptchaService } from './geetest/geetest.captcha.service';
import { RecaptchaCaptchaService } from './recaptcha/recaptcha.captcha.service';

@Module({
  providers: [
    CaptchaService,
    GeeTestCaptchaService,
    RecaptchaCaptchaService,
  ],
  controllers: [
    CaptchaController,
  ],
  exports: [
    CaptchaService,
  ],
})
export class CaptchaModule { }