import { inject, injectable } from 'inversify';
import { action, computed, observable } from 'mobx';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { IChangePasswordErrors } from '../components/ChangePassword/ChangePassword';
import { AccountExceptionsCodes } from '../../../../Shared/const/exceptions/AccountExceptionCodes';

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  code: string | null;
}

@injectable()
export class ChangePasswordStore {
  protected static readonly SEND_CHANGE_PASSWORD_ATTEMPT_TASK = 'SEND_CHANGE_PASSWORD_ATTEMPT_TASK';

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @observable isOldPasswordIncorrect = false;
  @observable isOldPasswordWrong = false;

  @observable isPasswordIncorrect = false;
  @observable isOldPasswordEqual = false;

  @observable is2FACodeIncorrect = false;
  @observable is2FACodeWrong = false;

  @observable isPasswordChanged = false;

  @computed
  get errors(): IChangePasswordErrors {
    const { isOldPasswordIncorrect, isOldPasswordWrong } = this;
    const { isPasswordIncorrect, isOldPasswordEqual } = this;
    const { is2FACodeIncorrect, is2FACodeWrong } = this;

    return {
      isOldPasswordIncorrect, isOldPasswordWrong,
      isPasswordIncorrect, isOldPasswordEqual,
      is2FACodeIncorrect, is2FACodeWrong,
    };
  }

  @action
  changePasswordAttempt(payload: IChangePasswordPayload) {
    if (payload.code === '') {
      payload.code = null;
    }

    this.loaderStore.addTask(ChangePasswordStore.SEND_CHANGE_PASSWORD_ATTEMPT_TASK);

    this.axiosWrapper.post('/account/settings/change_password', payload)
      .then(value => {
        this.isPasswordChanged = true;
        this.loaderStore.removeTask(ChangePasswordStore.SEND_CHANGE_PASSWORD_ATTEMPT_TASK);
      })
      .catch(reason => {
        for (const error of reason.data.message) {
          const isValidationFailed = !error.code;
          if (isValidationFailed) {
            if (error.property === 'oldPassword') {
              this.isOldPasswordIncorrect = true;
            }

            if (error.property === 'newPassword') {
              this.isPasswordIncorrect = true;
            }

            if (error.property === 'code') {
              this.is2FACodeIncorrect = true;
            }

            continue;
          }

          if (error.code === AccountExceptionsCodes.EqualPasswords) {
            this.isOldPasswordEqual = true;
          }

          if (error.code === AccountExceptionsCodes.IncorrectOldPassword) {
            this.isOldPasswordWrong = true;
          }

          if (error.code === AccountExceptionsCodes.Incorrect2FACode) {
            this.is2FACodeIncorrect = true;
          }
        }

        this.loaderStore.removeTask(ChangePasswordStore.SEND_CHANGE_PASSWORD_ATTEMPT_TASK);
      });
  }

  @action
  reset() {
    this.isPasswordChanged = false;
    this.resetErrors();
  }

  @action
  resetErrors() {
    this.isOldPasswordIncorrect = false;

    this.isOldPasswordWrong = false;
    this.isPasswordIncorrect = false;

    this.isOldPasswordEqual = false;
    this.is2FACodeIncorrect = false;

    this.is2FACodeWrong = false;
  }
}