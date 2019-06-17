import { action, computed, observable, runInAction } from 'mobx';
import { TransactionsStore } from '../../Transactions/stores/TransactionsStore';
import * as QRCode from 'qrcode';
import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { SessionStore } from '../../../../Shared/stores/SessionStore';
import { BankAccountsStore } from './BankAccountsStore';
import { CryptoWalletsStore } from './CryptoWalletsStore';
import { KycStatus, KycStatusValues } from '../constants/KycStatus';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { AccountType } from '../../../../Shared/const/AccountType';
import { ModalStore } from '../../../../Modals/store/ModalStore';

const ACCOUNT_STORE_FETCH_TASK = 'ACCOUNT_STORE_FETCH_TASK';
const REQUEST_REFERRALS_COUNT_TASK = 'REQUEST_REFERRALS_COUNT_TASK';

@injectable()
export class AccountStore {
  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(SessionStore)
  private readonly sessionStore: SessionStore;

  @inject(ModalStore)
  private readonly modalStore: ModalStore;

  @inject(TransactionsStore)
  private readonly transactionsStore: TransactionsStore;

  @inject(BankAccountsStore)
  private readonly bankAccountsStore: BankAccountsStore;

  @inject(CryptoWalletsStore)
  private readonly walletsStore: CryptoWalletsStore;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @computed
  get bankAccounts() {
    return this.bankAccountsStore.bankAccounts;
  }

  @computed
  get btcWallets() {
    return this.walletsStore.wallets;
  }

  @computed
  get isUnapproved() {
    return this.kyc.status === KycStatus.Unapproved;
  }

  @computed
  get hasExchangeAccess() {
    return this.kyc.status !== KycStatus.Unapproved
      && this.kyc.status !== KycStatus.Tier1Pending
      && this.kyc.status !== KycStatus.Tier1Rejected;
  }

  @computed
  get currentTier() {
    return KycStatusValues[this.kyc.status];
  }

  @computed
  get isTier2VerificationPassed() {
    return this.kyc.status === KycStatus.Tier2Approved;
  }

  @computed
  get isAccountLoaded() {
    return !!this.email;
  }

  @observable email: string;
  @observable type: AccountType;

  @observable btcWalletAddress: string = '';
  @observable btcWalletAddressQR: string = '';
  @observable ethWalletAddress: string = '';
  @observable ethWalletAddressQR: string = '';
  @observable ltcWalletAddress: string = '';
  @observable ltcWalletAddressQR: string = '';
  @observable zcnWalletAddress: string = '';
  @observable zcnWalletAddressQR: string = '';

  @observable twoFaEnabled: boolean;

  @observable kycStatus = KycStatus.Unapproved;
  @observable kycRejectReason = '';
  @observable kycForbiddenSend = false;

  @observable isPartner = false;
  @observable referralToken = '';
  @observable referralsCount = 0;
  @observable exchangeCommissionCoefficient: string;

  @observable kyc = {
    status: KycStatus.Unapproved,
    rejectReason: '',
  };

  @computed
  get accountType() {
    return this.type;
  }

  @action
  cryptoWalletAddress(value : string) {
    switch (value) {
      case 'BTC': return this.btcWalletAddress;
      case 'ETH': return this.ethWalletAddress;
      case 'ZCN': return this.zcnWalletAddress;
      case 'LTC': return this.ltcWalletAddress;
    }
  }

  @action
  cryptoWalletAddressQR(value : string) {
    switch (value) {
      case 'BTC': return this.btcWalletAddressQR;
      case 'ETH': return this.btcWalletAddressQR;
      case 'ZCN': return this.btcWalletAddressQR;
      case 'LTC': return this.btcWalletAddressQR;
    }
  }

  async safetyKycRejectReason(): Promise<string | undefined> {
    try {
      const sumsubData = await this.axiosWrapper.get('/account/kyc/sumsub');
      return sumsubData.clientReason;
    } catch (e) {
      return undefined;
    }
  }

  @action
  async fetchAccountData() {
    this.loaderStore.addTask(ACCOUNT_STORE_FETCH_TASK);

    try {
      const [ accountData, sumSubKycRejectReason ] = await Promise.all([
        this.axiosWrapper.get('/account'),
        this.safetyKycRejectReason(),
        this.walletsStore.fetchWallets(),
        this.bankAccountsStore.fetchBankAccounts(),
      ]);

      const kycRejectReason = sumSubKycRejectReason || accountData.kycRejectReason;

      if (accountData.ethWalletAddress && accountData.btcWalletAddress
          && accountData.ltcWalletAddress && accountData.zcnWalletAddress) {

        const [ btcQR ] = await Promise.all([
          QRCode.toDataURL(accountData.btcWalletAddress, { errorCorrectionLevel: 'H' }),
        ]);
        const [ ethQR ] = await Promise.all([
          QRCode.toDataURL(accountData.ethWalletAddress, { errorCorrectionLevel: 'H' }),
        ]);
        const [ ltcQR ] = await Promise.all([
          QRCode.toDataURL(accountData.ltcWalletAddress, { errorCorrectionLevel: 'H' }),
        ]);
        const [ zcnQR ] = await Promise.all([
          QRCode.toDataURL(accountData.zcnWalletAddress, { errorCorrectionLevel: 'H' }),
        ]);

        this.btcWalletAddress = accountData.btcWalletAddress;
        this.btcWalletAddressQR = btcQR;
        this.ethWalletAddress = accountData.ethWalletAddress;
        this.ethWalletAddressQR = ethQR;
        this.ltcWalletAddress = accountData.ltcWalletAddress;
        this.ltcWalletAddressQR = ltcQR;
        this.zcnWalletAddress = accountData.zcnWalletAddress;
        this.zcnWalletAddressQR = zcnQR;

      }

      runInAction(() => {
        this.email = accountData.email;
        this.type = accountData.type;

        this.kycStatus = accountData.kycStatus;
        this.kycRejectReason = kycRejectReason;
        this.kycForbiddenSend = accountData.kycForbiddenSend;

        this.kyc.status = accountData.kycStatus;
        this.kyc.rejectReason = kycRejectReason;


        this.twoFaEnabled = accountData.twoFaEnabled;

        this.isPartner = accountData.isPartner;
        this.referralToken = accountData.referralToken;
        this.exchangeCommissionCoefficient = accountData.exchangeCommissionCoefficient;
      });

    } catch (err) {
      if (err.status === 403) {
        this.sessionStore.refresh();
      }
      // tslint:disable-next-line:no-console
      console.log(err);
    } finally {
      this.loaderStore.removeTask(ACCOUNT_STORE_FETCH_TASK);
    }
  }

  @action
  async getReferralsCount() {
    this.loaderStore.addTask(REQUEST_REFERRALS_COUNT_TASK);

    try {
      this.referralsCount = await this.axiosWrapper.get('account/referrals').then(referralsAmount =>
      referralsAmount.referralsAmount);
    } catch (err) {
      console.log(err);
    }

    this.loaderStore.removeTask(REQUEST_REFERRALS_COUNT_TASK);
  }

  @action
  set2FAEnabled(state: boolean) {
    this.twoFaEnabled = state;
  }

  @action
  setKYCStatus(status: KycStatus) {
    this.kyc.status = status;
    this.kycStatus = status;
  }

  @action
  validateKYCStatus(): boolean {
    const rejectReason = this.kycRejectReason;
    const hasExchangeAccess = this.hasExchangeAccess;

    if (!hasExchangeAccess) {
      const kycStatus = this.kycStatus;

      if (kycStatus === KycStatus.Unapproved) {
        this.modalStore.openModal('EXCHANGE_UNAPPROVED');
      }

      if (kycStatus === KycStatus.Tier1Rejected) {
        this.modalStore.openModal('EXCHANGE_REJECT', {rejectReason});
      }

      if (kycStatus === KycStatus.Tier1Pending) {
        this.modalStore.openModal('TIER1_SUBMIT');
      }

      return false;
    }

    return true;
  }
}
