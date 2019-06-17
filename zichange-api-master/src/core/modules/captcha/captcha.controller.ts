import { Controller, Get } from '@nestjs/common';
import { GeeTestCaptchaService } from './geetest/geetest.captcha.service';
import { OutGeeTestCaptchaInitDTO } from './geetest/dto/out.geetest-captcha-init.dto';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { OutCaptchaSystemDTO } from './dto/out.captcha-system.dto';
import { ConfigsService } from '../../service/configs.service';

@Controller('captcha')
@ApiUseTags('Captcha')
export class CaptchaController {
  constructor(
    protected readonly geeTestCaptchaService: GeeTestCaptchaService,
  ) { }

  // region Common

  @Get('current_system')
  @ApiOperation({ title: 'Get current captcha system' })
  @ApiResponse({ status: 200, type: OutCaptchaSystemDTO })
  getCurrentCaptchaSystem(): OutCaptchaSystemDTO {
    return {
      captchaSystem: ConfigsService.captchaSystem,
    };
  }

  // endregion

  // region GeeTest

  @Get('geetest/init')
  @ApiOperation({ title: 'Init GeeTest captcha' })
  @ApiResponse({ status: 200, type: OutGeeTestCaptchaInitDTO })
  async initCaptcha(): Promise<OutGeeTestCaptchaInitDTO> {
    return await this.geeTestCaptchaService.initCaptcha();
  }

  // endregion
}