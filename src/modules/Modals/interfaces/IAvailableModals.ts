import { ComponentClass } from 'react';
import DepositFiat from '../../Dashboard/modules/Exchange/components/Modals/DepositFiat';
import WithdrawFiat from '../../Dashboard/modules/Exchange/components/Modals/WithdrawFiat';
import WithdrawCrypto from '../../Dashboard/modules/Exchange/components/Modals/WithdrawCrypto';
import DepositCrypto from '../../Dashboard/modules/Exchange/components/Modals/DepositCrypto';
import DepositLimitExceededModal from '../../Dashboard/modules/Exchange/components/Modals/DepositLimitExceededModal';
import WithdrawLimitExceededModal from '../../Dashboard/modules/Exchange/components/Modals/WithdrawLimitExceededModal';
import WalletErrorModal from '../../Dashboard/modules/Profile/components/CryptoWallets/WalletErrorModal';
import BankAccountErrorModal from '../../Dashboard/modules/Profile/components/BankAccounts/BankAccountErrorModal';
import RequestResetPasswordErrorModal
  from '../../Authorization/modules/ResetPassword/Request/Modal/RequestResetPasswordErrorModal';
import AuthorizationModal from '../../Counterparty/modules/Authorization/modals/AuthorizationModal';
import VerificationModal from '../../Counterparty/modules/Verification/modals/VerificationModal';
import PaymentModal from '../../Counterparty/modules/PaymentMethod/modals/PaymentModal';
import ReSendCodeModal from '../../Counterparty/modules/Authorization/modals/ReSendCodeModal';
import WalletsNotFoundModal from '../../Dashboard/modules/Exchange/components/Modals/WalletsNotFoundModal';
import SessionExpiredContainer from '../../Authorization/modules/SessionExpired/SessionExpiredContainer';

export interface IAvailableModals {
  'SUCCESS': ComponentClass<any>;
  'ADD_WALLET': ComponentClass<any>;
  'CHANGE_WALLET': ComponentClass<any>;
  'TIER1_SUBMIT': ComponentClass<any>;
  'ADD_BANK': ComponentClass<any>;
  'CHANGE_BANK': ComponentClass<any>;
  'DELETE_CONFIRM': ComponentClass<any>;
  'BANK_INFO': ComponentClass<any>;
  'EXCHANGE_REJECT': ComponentClass<any>;
  'EXCHANGE_UNAPPROVED': ComponentClass<any>;
  'ERROR': ComponentClass<any>;
  'DEPOSIT_FIAT': typeof DepositFiat;
  'WITHDRAW_FIAT': typeof WithdrawFiat;
  'WITHDRAW_CRYPTO': typeof WithdrawCrypto;
  'DEPOSIT_CRYPTO': typeof DepositCrypto;
  'PLEASE_ENABLE_2FA': ComponentClass<any>;
  'TRANSACTION_CHANGE_WITHDRAWAL_2FA': ComponentClass<any>;
  'CONTACT_US': ComponentClass<any>;
  'REFERRAL_REGISTER': ComponentClass<any>;
  'DEPOSIT_LIMIT_EXCEEDED': typeof DepositLimitExceededModal;
  'WITHDRAW_LIMIT_EXCEEDED': typeof WithdrawLimitExceededModal;
  'CRYPTO_WALLET_ALREADY_HAVE': typeof WalletErrorModal;
  'BANK_ACCOUNT_ALREADY_HAVE': typeof BankAccountErrorModal;
  'EMAIL_NOT_FOUND': typeof RequestResetPasswordErrorModal;
  'WALLETS_NOT_FOUND': typeof WalletsNotFoundModal;
  'SESSION_EXPIRED': typeof SessionExpiredContainer;

  'COUNTERPARTY_AUTHORIZATION': typeof AuthorizationModal;
  'COUNTERPARTY_VERIFICATION': typeof VerificationModal;
  'COUNTERPARTY_PAYMENT': typeof PaymentModal;
  'COUNTERPARTY_RESEND_CODE': typeof ReSendCodeModal;
}
