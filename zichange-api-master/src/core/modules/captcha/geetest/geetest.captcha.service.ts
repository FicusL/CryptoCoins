import { Injectable, Logger } from '@nestjs/common';
import * as Geetest from 'gt3-sdk';
import { CaptchaExceptions } from '../captcha.exceptions';
import { OutGeeTestCaptchaInitDTO } from './dto/out.geetest-captcha-init.dto';
import { InGeeTestCaptchaDTO } from './dto/in.geetest-captcha.dto';
import { validate } from 'class-validator';
import { ConfigsService } from '../../../service/configs.service';

@Injectable()
export class GeeTestCaptchaService {
  private readonly captcha = new Geetest({
    geetest_id: ConfigsService.geetestId,
    geetest_key: ConfigsService.geetestKey,
  });

  // region Public methods

  public initCaptcha(): Promise<OutGeeTestCaptchaInitDTO> {
    return new Promise((resolve, reject) => {
      this.captcha.register({

        client_type: 'unknown', // TODO: think about it
        ip_address: 'unknown', // TODO: think about it

      }, (err, data) => {
        if (err) {
          Logger.error(err, undefined, GeeTestCaptchaService.name);
          reject(new CaptchaExceptions.GeeTestCaptchaErrorInit());
          return;
        }

        resolve({
          success: data.success,
          challenge: data.challenge,
          gt: data.gt,
          new_captcha: data.new_captcha,
          fallback: !data.success,
        });
      });
    });
  }

  public async verifyCaptchaFromString(data: string): Promise<void> {
    let dto: InGeeTestCaptchaDTO;
    try {
      const raw = JSON.parse(data);
      dto = new InGeeTestCaptchaDTO(raw);
    } catch (e) {
      throw new CaptchaExceptions.IncorrectCaptcha();
    }

    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new CaptchaExceptions.IncorrectCaptcha();
    }

    return await this.verifyCaptcha(dto);
  }

  public verifyCaptcha(dto: InGeeTestCaptchaDTO): Promise<void> {
    return new Promise((resolve, reject) => {
      this.captcha.validate(dto.fallback, {

        geetest_challenge: dto.geetest_challenge,
        geetest_validate: dto.geetest_validate,
        geetest_seccode: dto.geetest_seccode,

      }, (err, success) => {
        if (err) {
          Logger.error(err, undefined, GeeTestCaptchaService.name);
          reject(new CaptchaExceptions.GeeTestCaptchaInternalError());
          return;
        }

        if (!success) {
          reject(new CaptchaExceptions.IncorrectCaptcha());
          return;
        }

        resolve();
      });
    });
  }

  // endregion
}