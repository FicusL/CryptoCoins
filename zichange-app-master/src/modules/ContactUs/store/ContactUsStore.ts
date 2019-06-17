import { inject, injectable } from 'inversify';
import { action, observable } from 'mobx';
import { AxiosResponse } from 'axios';
import { AxiosWrapper } from '../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../Shared/modules/Loader/store/LoaderStore';
import { IInContactUsDTO } from './dto/IInContactUsDTO';

@injectable()
export class ContactUsStore {
  static readonly SEND_CONTACT_US_TASK = 'SEND_CONTACT_US_TASK';

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @observable isEmailIncorrect = false;
  @observable isFirstNameIncorrect = false;
  @observable isLastNameIncorrect = false;
  @observable isMessageIncorrect = false;

  @action
  reset() {
    this.isEmailIncorrect = false;
    this.isFirstNameIncorrect = false;
    this.isLastNameIncorrect = false;
    this.isMessageIncorrect = false;
  }

  @action
  async contactInfoSendAttempt(payload: IInContactUsDTO) {
    this.loaderStore.addTask(ContactUsStore.SEND_CONTACT_US_TASK);

    return this.axiosWrapper.post('/contact-us', payload)
      .then(this.onContactInfoSendAttemptSuccess)
      .catch(this.onContactInfoSendAttemptError);
    }

  @action.bound
  onContactInfoSendAttemptSuccess() {
    this.loaderStore.removeTask(ContactUsStore.SEND_CONTACT_US_TASK);
  }

  @action.bound
  onContactInfoSendAttemptError(reason: AxiosResponse) {
    for (const error of reason.data.message) {
      this.isEmailIncorrect = error.property === 'email';
      this.isFirstNameIncorrect = error.property === 'firstName';
      this.isLastNameIncorrect = error.property === 'lastName';
      this.isMessageIncorrect = error.property === 'message';
    }

    this.loaderStore.removeTask(ContactUsStore.SEND_CONTACT_US_TASK);
    throw reason;
  }
}