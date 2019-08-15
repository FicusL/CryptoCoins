import { ClassType } from 'class-transformer/ClassTransformer';
import { BaseFormStore, IValues } from '../../../../../../Shared/stores/Forms/BaseFormStore';
import { Equals } from 'class-validator';
import { action } from 'mobx';
import { inject } from 'inversify';
import { KycDataStore } from '../KycDataStore';

export class ConfirmationValues implements IValues {
  @Equals(true)
  accurateInfo: boolean;

  @Equals(true)
  notifyBaGukAboutIncorrectInfo: boolean;

  @Equals(true)
  processingPersonalData: boolean;

  @Equals(true)
  BaGukTransferIdentificationData: boolean;
}

export class ConfirmationStore extends BaseFormStore<ConfirmationValues> {
  get type(): ClassType<ConfirmationValues> {
    return ConfirmationValues;
  }

  @inject(KycDataStore)
  kycDataStore: KycDataStore;

  @action
  loadLocalStorage() {
    const getCacheItem = (name: string) => window.localStorage.getItem(name);
    const kycData = () => (this.kycDataStore.kycData.beneficiariesAndRepresentatives || {});
    const getValue = (name: string) => (getCacheItem(name)  === 'true' || kycData[name] === 'true' || null);
    
    this.values.accurateInfo = getValue('accurateInfo');
    this.values.notifyBaGukAboutIncorrectInfo = getValue('notifyBaGukAboutIncorrectInfo');
    this.values.processingPersonalData = getValue('processingPersonalData');
    this.values.BaGukTransferIdentificationData = getValue('BaGukTransferIdentificationData');
  }
}