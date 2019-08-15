import { AccountStore } from './modules/Profile/stores/AccountStore';
import { TransactionsStore } from './modules/Transactions/stores/TransactionsStore';
import { ChangePasswordStore } from './modules/Profile/stores/ChangePasswordStore';
import { Disable2FAStore } from './modules/Profile/stores/Disable2FAStore';
import { Enable2FAStore } from './modules/Profile/stores/Enable2FAStore';
import { Tier1Store } from './modules/Verification/NaturalVerification/stores/Tier1Store';
import { PersonalInformationStore } from './modules/Verification/NaturalVerification/stores/parts/PersonalInformationStore';
import { DocumentsStore } from './modules/Verification/NaturalVerification/stores/parts/DocumentsStore';
import { BeneficiariesAndRepresentativesStore } from './modules/Verification/NaturalVerification/stores/parts/BeneficiariesAndRepresentativesStore';
import { ConfirmationStore } from './modules/Verification/NaturalVerification/stores/parts/ConfirmationStore';
import { CryptoWalletsStore } from './modules/Profile/stores/CryptoWalletsStore';
import { BankAccountsStore } from './modules/Profile/stores/BankAccountsStore';
import { ExchangeStore } from './modules/Exchange/store/ExchangeStore';
import { LegalVerificationStore } from './modules/Verification/LegalVerification/store/LegalVerificationStore';
import { CustomerInformationStore } from './modules/Verification/LegalVerification/store/parts/CustomerInformationStore';
import { RepresentativeDataStore } from './modules/Verification/LegalVerification/store/parts/RepresentativeDataStore';
import { ManagementPersonalDataStore } from './modules/Verification/LegalVerification/store/parts/ManagementPersonalDataStore';
import { WalletStore } from './modules/Exchange/store/WalletStore';
import { WalletDepositCryptoStore } from './modules/Exchange/store/crypto/WalletDepositCryptoStore';
import { WalletWithdrawCryptoStore } from './modules/Exchange/store/crypto/WalletWithdrawCryptoStore';
import { WalletDepositFiatStore } from './modules/Exchange/store/fiat/WalletDepositFiatStore';
import { WalletWithdrawFiatStore } from './modules/Exchange/store/fiat/WalletWithdrawFiatStore';
import { BeneficiariesDataStore } from './modules/Verification/LegalVerification/store/parts/BeneficiariesDataStore';
import { MainPartnersStore } from './modules/Verification/LegalVerification/store/parts/MainPartnersStore';
import { OtherInfoStore } from './modules/Verification/LegalVerification/store/parts/OtherInfoStore';
import { ExchangeRatesStore } from '../Shared/modules/Rates/store/ExchangeRatesStore';
import { AdvancedCashPaymentStore } from './modules/PaymentMethods/stores/AdvancedCashPaymentStore';
import { PayeerPaymentStore } from './modules/PaymentMethods/stores/PayeerPaymentStore';
import { OperationProgressStore } from './modules/Transactions/stores/OperationProgressStore';
import { RoyalPayPaymentStore } from './modules/PaymentMethods/stores/RoyalPayPaymentStore';
import { KycDataStore } from './modules/Verification/NaturalVerification/stores/KycDataStore';
import { PersonStore } from './modules/Verification/LegalVerification/store/parts/PersonStore';

export const dashboardSingletons = [
  TransactionsStore,

  AdvancedCashPaymentStore,
  PayeerPaymentStore,
  RoyalPayPaymentStore,

  // Exchange
  ExchangeRatesStore,
  ExchangeStore,
  OperationProgressStore,

  // Account
  WalletStore,

  WalletDepositFiatStore,
  WalletWithdrawFiatStore,

  WalletDepositCryptoStore,
  WalletWithdrawCryptoStore,

  // Profile
  AccountStore,
  CryptoWalletsStore,
  BankAccountsStore,

  // Settings
  ChangePasswordStore,
  Disable2FAStore,
  Enable2FAStore,

  // Tier 1 verification
  Tier1Store,
  PersonalInformationStore,
  BeneficiariesAndRepresentativesStore,
  DocumentsStore,
  ConfirmationStore,
  KycDataStore,

  // Legal verification
  LegalVerificationStore,
  CustomerInformationStore,
  PersonStore,
  RepresentativeDataStore,
  ManagementPersonalDataStore,
  BeneficiariesDataStore,
  MainPartnersStore,
  OtherInfoStore,
];
