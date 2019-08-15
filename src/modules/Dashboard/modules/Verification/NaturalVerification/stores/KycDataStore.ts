import { AxiosWrapper } from '../../../../../Shared/services/AxiosWrapper';
import { inject, injectable } from 'inversify';
import { action, observable } from 'mobx';
import { LoaderStore } from '../../../../../Shared/modules/Loader/store/LoaderStore';

export const GET_DATA_KYC = 'GET_DATA_KYC';
export const GET_SUMSUB = 'GET_SUMSUB';
export const POST_DATA_KYC = 'POST_DATA_KYC';

@injectable()
export class KycDataStore {

  @inject(AxiosWrapper)
  api: AxiosWrapper;

  @inject(LoaderStore)
  loaderStore: LoaderStore;

  @observable kycData: any = {};
  @observable lastSentDocumentsInfo: any;

  @action
  async getSumSub() {
    this.loaderStore.addTask(GET_SUMSUB);
    await this.api.get('/account/kyc/sumsub')
      .then((data) => {
        this.lastSentDocumentsInfo = data.lastSentDocumentsInfo;
        this.loaderStore.removeTask(GET_SUMSUB);
      })
      .catch(() => {
        this.loaderStore.removeTask(GET_SUMSUB);
      });
  }

  @action
  async loadToDataBase(payload) {
    this.loaderStore.addTask(POST_DATA_KYC);
    await this.api.post('/account/kyc/state', payload)
      .then(() => this.loaderStore.removeTask(POST_DATA_KYC))
      .catch(() => this.loaderStore.removeTask(POST_DATA_KYC));
  }

  @action
  async loadFromDataBase() {
    this.loaderStore.addTask(GET_DATA_KYC);
    await this.api.get('/account/kyc/state')
      .then((result) => {
        this.kycData = result;
        this.loaderStore.removeTask(GET_DATA_KYC);
      })
      .catch(() => this.loaderStore.removeTask(GET_DATA_KYC));
  }
}