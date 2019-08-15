import './style.scss';
import * as React from 'react';
import { observer } from 'mobx-react';
import { lazyInject } from '../../IoC';
import { ModalStore } from '../store/ModalStore';
import { IAvailableModals } from '../interfaces/IAvailableModals';
import ModalSuccess from '../components/Success';
import UpdateWalletModal from '../../Dashboard/modules/Profile/components/CryptoWallets/UpdateWalletModal';
import AddWalletModal from '../../Dashboard/modules/Profile/components/CryptoWallets/AddWalletModal';
import AddBankAccountModal from '../../Dashboard/modules/Profile/components/BankAccounts/AddBankAccountModal';
import UpdateBankAccountModal from '../../Dashboard/modules/Profile/components/BankAccounts/UpdateBankAccountModal';
import Tier1SubmitModal
  from '../../Dashboard/modules/Verification/NaturalVerification/components/Tier1Submit/Tier1SubmitModal';
import BankInfoModal from '../../Dashboard/modules/Transactions/containers/PaymentDetails/BankInfoModal';
import ExchangeRejectReasonModal from '../../Dashboard/modules/Exchange/components/Modals/ExchangeRejectReasonModal';
import ModalError from '../../Dashboard/modules/Transactions/containers/PaymentDetails/ModalError';
import DepositFiat from '../../Dashboard/modules/Exchange/components/Modals/DepositFiat';
import WithdrawFiat from '../../Dashboard/modules/Exchange/components/Modals/WithdrawFiat';
import WithdrawCrypto from '../../Dashboard/modules/Exchange/components/Modals/WithdrawCrypto';
import DepositCrypto from '../../Dashboard/modules/Exchange/components/Modals/DepositCrypto';
import ExchangeUnapprovedModal from '../../Dashboard/modules/Exchange/components/Modals/ExchangeUnapprovedModal';
import PleaseEnable2Fa from '../../Dashboard/modules/Exchange/components/Modals/PleaseEnable2Fa';
import DeleteConfirmModal from '../../Dashboard/modules/Profile/components/Modals/DeleteConfirmModal';
import TransactionChangeWithdrawal2FAModal
  from '../../Dashboard/modules/Transactions/components/Modals/TransactionChangeWithdrawal2FAModal';
import ContactUsModal from '../../ContactUs/ContactUsModal';
import RegisterReferralModal from '../../Referral/components/RegisterReferralModal';
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
import SessionDoneContainer from '../../Authorization/modules/SessionExpired/SessionExpiredContainer';
import SessionExpiredContainer from '../../Authorization/modules/SessionExpired/SessionExpiredContainer';


@observer
class ModalContainer extends React.Component {
  @lazyInject(ModalStore)
  private readonly modalStore: ModalStore;

  private readonly modals: IAvailableModals = {
    SUCCESS: ModalSuccess,
    CHANGE_WALLET: UpdateWalletModal,
    ADD_WALLET: AddWalletModal,
    ADD_BANK: AddBankAccountModal,
    CHANGE_BANK: UpdateBankAccountModal,
    TIER1_SUBMIT: Tier1SubmitModal,
    BANK_INFO: BankInfoModal,
    EXCHANGE_REJECT: ExchangeRejectReasonModal,
    EXCHANGE_UNAPPROVED: ExchangeUnapprovedModal,
    ERROR: ModalError,
    DEPOSIT_FIAT: DepositFiat,
    WITHDRAW_FIAT: WithdrawFiat,
    WITHDRAW_CRYPTO: WithdrawCrypto,
    DEPOSIT_CRYPTO: DepositCrypto,
    PLEASE_ENABLE_2FA: PleaseEnable2Fa,
    DELETE_CONFIRM: DeleteConfirmModal,
    TRANSACTION_CHANGE_WITHDRAWAL_2FA: TransactionChangeWithdrawal2FAModal,
    CONTACT_US: ContactUsModal,
    REFERRAL_REGISTER: RegisterReferralModal,
    DEPOSIT_LIMIT_EXCEEDED: DepositLimitExceededModal,
    WITHDRAW_LIMIT_EXCEEDED: WithdrawLimitExceededModal,
    CRYPTO_WALLET_ALREADY_HAVE: WalletErrorModal,
    BANK_ACCOUNT_ALREADY_HAVE: BankAccountErrorModal,
    EMAIL_NOT_FOUND: RequestResetPasswordErrorModal,
    WALLETS_NOT_FOUND: WalletsNotFoundModal,
    SESSION_EXPIRED: SessionExpiredContainer,

    COUNTERPARTY_AUTHORIZATION: AuthorizationModal,
    COUNTERPARTY_VERIFICATION: VerificationModal,
    COUNTERPARTY_PAYMENT: PaymentModal,
    COUNTERPARTY_RESEND_CODE: ReSendCodeModal,
  };

  render() {
    return this.modalStore.openedModals.map((modal, i) => {
      const Modal = this.modals[modal.name] as any;
      return (
        <Modal
          key={i}
          onClose={() => this.modalStore.closeModal(modal.name)}
          {...modal.props}
        />
      );
    });
  }
}

export default ModalContainer;
