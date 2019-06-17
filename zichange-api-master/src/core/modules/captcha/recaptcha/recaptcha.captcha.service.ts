import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as requestIp from 'request-ip';
import { CaptchaExceptions } from '../captcha.exceptions';

@Injectable()
export class RecaptchaCaptchaService {
  private readonly secret: string = '6LdscmIUAAAAAMbC_TGKFQ04wS2UKXqv-jc5j_r7'; // TODO: delete it later

  async verifyCaptcha(req, token: string) {
    const clientIP = requestIp.getClientIp(req);

    let isValidated: boolean = false;
    try {
      const { data } = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${this.secret}&response=${token}&remoteip=${clientIP}`,
      );
      isValidated = data.success;
    } catch (e) {
      throw new CaptchaExceptions.ReCaptchaApiNotRespond();
    }

    if (!isValidated) {
      throw new CaptchaExceptions.IncorrectCaptcha();
    }
  }
}