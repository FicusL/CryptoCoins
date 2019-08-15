import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { action, computed, observable } from 'mobx';
import * as QRCode from 'qrcode';
import { IEnable2FAErrors } from '../components/Enable2FA/Enable2FA';
import { AccountStore } from './AccountStore';
import { AccountExceptionsCodes } from '../../../../Shared/const/exceptions/AccountExceptionCodes';
import { AxiosResponse } from 'axios';

interface IEnablePayload {
  code: string;
  password: string;
}

@injectable()
export class Enable2FAStore {
  protected static readonly REQUEST_2FA_QR_CODE_TASK = 'REQUEST_2FA_QR_CODE_TASK';
  protected static readonly SEND_ENABLE_2FA_TASK = 'SEND_ENABLE_2FA_TASK';

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(AccountStore)
  private readonly accountStore: AccountStore;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @observable QRCode;
  @observable secret: string = '';
  @observable isEnabled = false;

  @observable isPasswordIncorrect = false;
  @observable isPasswordWrong = false;
  @observable is2FACodeIncorrect = false;
  @observable is2FACodeWrong = false;

  @computed get errors(): IEnable2FAErrors {
    const { isPasswordIncorrect, isPasswordWrong } = this;
    const { is2FACodeIncorrect, is2FACodeWrong } = this;

    return {
      isPasswordIncorrect, isPasswordWrong,
      is2FACodeIncorrect, is2FACodeWrong,
    };
  }

  @action
  getQrCode() {
    this.loaderStore.addTask(Enable2FAStore.REQUEST_2FA_QR_CODE_TASK);

    this.axiosWrapper.post('/account/settings/2fa/generate')
      .then((secret: any) => {
        QRCode.toDataURL(secret.otpauth_url)
          .then(qrCode => {
            this.QRCode = qrCode;
            this.secret = secret.base32;
            this.loaderStore.removeTask(Enable2FAStore.REQUEST_2FA_QR_CODE_TASK);
          });
      })
      .catch(reason => {
        this.loaderStore.removeTask(Enable2FAStore.REQUEST_2FA_QR_CODE_TASK);
      });
  }

  @action
  enable2FA(payload: IEnablePayload) {
    this.loaderStore.addTask(Enable2FAStore.SEND_ENABLE_2FA_TASK);

    this.axiosWrapper.post('/account/settings/2fa/enable', payload)
      .then(() => {
        this.isEnabled = true;
        this.accountStore.set2FAEnabled(true);
        this.loaderStore.removeTask(Enable2FAStore.SEND_ENABLE_2FA_TASK);
      })
      .catch((reason: AxiosResponse) => {
        for (const error of reason.data.message) {
          const isValidationFailed = !error.code;
          if (isValidationFailed) {
            if (error.property === 'password') {
              this.isPasswordIncorrect = true;
            }

            if (error.property === 'code') {
              this.is2FACodeIncorrect = true;
            }

            continue;
          }

          if (error.code === AccountExceptionsCodes.IncorrectPassword) {
            this.isPasswordWrong = true;
          }

          if (error.code === AccountExceptionsCodes.Incorrect2FACode) {
            this.is2FACodeWrong = true;
          }
        }

        this.loaderStore.removeTask(Enable2FAStore.SEND_ENABLE_2FA_TASK);
      });
  }

  @action
  reset() {
    this.QRCode = undefined;
    this.isEnabled = false;
    this.secret = '';
    this.resetErrors();
  }

  @action
  resetErrors() {
    this.is2FACodeIncorrect = false;
    this.is2FACodeWrong = false;
    this.isPasswordIncorrect = false;
    this.isPasswordWrong = false;
  }

}