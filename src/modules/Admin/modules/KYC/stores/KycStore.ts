import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { action, computed, observable } from 'mobx';
import { KycModel } from '../model/KycModel';
import { IOutKycDTO } from '../dto/IOutKycDTO';
import { KycStatus } from '../../../../Dashboard/modules/Profile/constants/KycStatus';
import { IInKycFiltersDTO } from '../dto/IInKycFiltersDTO';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';

export const FETCH_KYC = 'FETCH_KYC';

@injectable()
export class KycStore {
  @inject(AxiosWrapper)
  api: AxiosWrapper;

  @inject(LoaderStore)
  loaderStore: LoaderStore;

  @observable kycMap = new Map<number, KycModel>();

  @computed
  get kyc(): KycModel[] {
    return Array.from(this.kycMap.values());
  }

  @action
  kycByFilters(filters: IInKycFiltersDTO) {
    return this.kyc.filter(kyc => filters.statuses.find(status => status === kyc.status));
  }

  @action
  async fetchKyc(filters?: IInKycFiltersDTO) {
    this.loaderStore.addTask(FETCH_KYC);
    this.kycMap.clear();

    const kycDtos : IOutKycDTO[] = await this.api.post('/account/kyc', filters);

    kycDtos.forEach(dto => this.kycMap.set(dto.accountId, new KycModel(dto)));
    this.loaderStore.removeTask(FETCH_KYC);
  }

  @action
  async getKyc(accountId: string) {
    const kycDto : IOutKycDTO = await this.api.get(`/account/${accountId}/kyc`);

    this.kycMap.set(kycDto.accountId, new KycModel(kycDto));

    return new KycModel(kycDto);
  }

  @action
  async changeKycStatus(accountId: string, status: KycStatus, rejectReason?: string) {
    try {
      await this.api.put(`/account/${accountId}/kyc`, {
        status,
        rejectReason,
      });

      return true;
    } catch (e) {
      return false;
    }
  }

}