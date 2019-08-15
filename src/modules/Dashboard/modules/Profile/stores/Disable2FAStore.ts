import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { action, computed, observable } from 'mobx';
import { AccountStore } from './AccountStore';
import { IDisable2FAErrors } from '../components/Disable2FA/Disable2FA';
import { AccountExceptionsCodes } from '../../../../Shared/const/exceptions/AccountExceptionCodes';
import { AxiosResponse } from 'axios';

interface IDisablePayload {
  code: string;
  password: string;
}

@injectable()
export class Disable2FAStore {
  protected static readonly SEND_DISABLE_2FA_TASK = 'SEND_DISABLE_2FA_TASK';

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(AccountStore)
  private readonly accountStore: AccountStore;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @observable isDisabled = false;

  @observable isPasswordIncorrect = false;
  @observable isPasswordWrong = false;
  @observable is2FACodeIncorrect = false;
  @observable is2FACodeWrong = false;

  @computed get errors(): IDisable2FAErrors {
    const { isPasswordIncorrect, isPasswordWrong } = this;
    const { is2FACodeIncorrect, is2FACodeWrong } = this;

    return {
      isPasswordIncorrect, isPasswordWrong,
      is2FACodeIncorrect, is2FACodeWrong,
    };
  }

  @action
  disable2FA(payload: IDisablePayload) {
    this.loaderStore.addTask(Disable2FAStore.SEND_DISABLE_2FA_TASK);

    this.axiosWrapper.post('/account/settings/2fa/disable', payload)
      .then(() => {
        this.isDisabled = true;
        this.accountStore.set2FAEnabled(false);
        this.loaderStore.removeTask(Disable2FAStore.SEND_DISABLE_2FA_TASK);
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

        this.loaderStore.removeTask(Disable2FAStore.SEND_DISABLE_2FA_TASK);
      });
  }

  @action
  reset() {
    this.isDisabled = false;
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