import * as React from 'react';
import Button from '../../../../Shared/components/Buttons/Button';
import { FormattedMessage } from 'react-intl';
import { lazyInject } from '../../../../IoC';
import { AccountStore } from '../stores/AccountStore';
import { Enable2FAStore } from '../stores/Enable2FAStore';
import ChangePassword from '../components/ChangePassword/ChangePassword';
import Enable2FA from '../components/Enable2FA/Enable2FA';
import Disable2FA from '../components/Disable2FA/Disable2FA';
import ChangePasswordSuccess from '../components/ChangePassword/ChangePasswordSuccess';
import Enable2FASuccess from '../components/Enable2FA/Enable2FASuccess';
import Disable2FASuccess from '../components/Disable2FA/Disable2FASuccess';
import { Disable2FAStore } from '../stores/Disable2FAStore';
import { ChangePasswordStore } from '../stores/ChangePasswordStore';
import { observer } from 'mobx-react';
import { LocaleStore } from '../../../../Shared/stores/LocaleStore';

interface IState {
  isChangePasswordOpen: boolean;
  isEnable2FAOpen: boolean;
  isDisable2FAOpen: boolean;
}

const defaultState: IState = {
  isChangePasswordOpen: false,
  isEnable2FAOpen: false,
  isDisable2FAOpen: false,
};

@observer
class SettingsContainer extends React.Component<{}, IState> {
  state = defaultState;

  @lazyInject(AccountStore)
  readonly accountStore: AccountStore;

  @lazyInject(ChangePasswordStore)
  readonly changePasswordStore: ChangePasswordStore;

  @lazyInject(Enable2FAStore)
  readonly enable2FAStore: Enable2FAStore;

  @lazyInject(Disable2FAStore)
  readonly disable2FAStore: Disable2FAStore;

  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  onChangePasswordRequestResetErrors = () => {
    this.changePasswordStore.resetErrors();
  };

  onChangePasswordRequestClose = () => {
    this.setState({ isChangePasswordOpen: false });
    this.onChangePasswordRequestResetErrors();
  };

  onChangePasswordSuccessRequestClose = () => {
    this.changePasswordStore.reset();
    this.onChangePasswordRequestClose();
  };

  // Enable 2FA handlers
  on2FAEnableRequestResetErrors = () => {
    this.enable2FAStore.resetErrors();
  };

  on2FAEnableRequestClose = () => {
    this.setState({ isEnable2FAOpen: false });
    this.on2FAEnableRequestResetErrors();
  };

  onEnable2FASuccessRequestClose = () => {
    this.enable2FAStore.reset();
    this.on2FAEnableRequestClose();
  };

  // Disable 2FA handler
  on2FADisableRequestResetErrors = () => {
    this.disable2FAStore.resetErrors();
  };

  on2FADisableRequestClose = () => {
    this.setState({ isDisable2FAOpen: false });
    this.on2FADisableRequestResetErrors();
  };

  onChangePasswordRequestOpen = () => {
    this.setState({ isChangePasswordOpen: true });
  };

  on2FAToggleRequestOpen = () => {
    const { twoFaEnabled } = this.accountStore;
    if (twoFaEnabled) {
      this.setState({ isDisable2FAOpen: true });
    } else {
      this.setState({ isEnable2FAOpen: true });
      if (!this.enable2FAStore.QRCode) {
        this.enable2FAStore.getQrCode();
      }
    }
  };

  on2FADisableSuccessRequestClose = () => {
    this.disable2FAStore.reset();
    this.on2FADisableRequestClose();
  };

  // Submits
  onChangePasswordSubmit = (oldPassword: string, newPassword: string, code: string) => {
    const payload = { oldPassword, newPassword, code };
    this.changePasswordStore.changePasswordAttempt(payload);
  };

  onEnable2FASubmit = (password: string, code: string) => {
    const payload = { password, code };
    this.enable2FAStore.enable2FA(payload);
  };

  onDisable2FASubmit = (password: string, code: string) => {
    const payload = { password, code };
    this.disable2FAStore.disable2FA(payload);
  };

  render() {
    const { locale } = this.localeStore;
    const { email, twoFaEnabled } = this.accountStore;
    const { isChangePasswordOpen, isEnable2FAOpen, isDisable2FAOpen } = this.state;

    const { changePasswordStore, enable2FAStore, disable2FAStore } = this;
    const { isPasswordChanged } = changePasswordStore;

    return (
      <div className='account__options'>
        <ChangePassword
          isOpen={isChangePasswordOpen && !isPasswordChanged}
          show2FA={twoFaEnabled}
          onSubmit={this.onChangePasswordSubmit}
          onRequestClose={this.onChangePasswordRequestClose}
          onRequestResetErrors={this.onChangePasswordRequestResetErrors}
          errors={changePasswordStore.errors}
        />
        <ChangePasswordSuccess
          isOpen={isPasswordChanged}
          onCloseRequest={this.onChangePasswordSuccessRequestClose}
        />
        <Enable2FA
          email={email}
          isOpen={isEnable2FAOpen && !enable2FAStore.isEnabled}
          onSubmit={this.onEnable2FASubmit}
          onRequestClose={this.on2FAEnableRequestClose}
          onRequestErrorsReset={this.on2FAEnableRequestResetErrors}

          QRCode={enable2FAStore.QRCode}
          secret={enable2FAStore.secret}
          errors={enable2FAStore.errors}
        />
        <Enable2FASuccess
          isOpen={enable2FAStore.isEnabled}
          onCloseRequest={this.onEnable2FASuccessRequestClose}
        />
        <Disable2FA
          email={email}
          isOpen={isDisable2FAOpen && !disable2FAStore.isDisabled}
          onSubmit={this.onDisable2FASubmit}
          onRequestClose={this.on2FADisableRequestClose}
          onRequestErrorsReset={this.on2FADisableRequestResetErrors}
          errors={disable2FAStore.errors}
        />
        <Disable2FASuccess
          isOpen={disable2FAStore.isDisabled}
          onCloseRequest={this.on2FADisableSuccessRequestClose}
        />

        <div className='row align-items-center justify-content-between account__options__password-container'>
          <div className='col-12 col-md-8 text-center text-md-left'>
            <h3 className='header'>
              <FormattedMessage id='dashboard.settings.email' defaultMessage='Email' />
            </h3>
          </div>
          <div className='col-12 col-md-4 text-center text-md-right'>
            {email}
          </div>
        </div>
        <div className='row align-items-center justify-content-between account__options__password-container'>
          <div className='col-12 col-md-8 text-center text-md-left'>
            <h3 className='header'>
              <FormattedMessage id='dashboard.settings.password' />
            </h3>
            <p className='header_description'>
              <FormattedMessage id='dashboard.settings.passwordDescription' />
            </p>
          </div>
          <div className='col-12 col-md-4 text-center text-md-right'>
            <Button onClick={() => this.onChangePasswordRequestOpen()} className='dashboard-btn dashboard-btn--white'>
              <FormattedMessage id='dashboard.settings.btnChange' />
            </Button>
          </div>
        </div>
        <div className='row align-items-center justify-content-between account__options__2FA-container'>
          <div className='col-12 col-md-8 text-center text-md-left'>
            <h3 className='header'>
              <FormattedMessage id='dashboard.settings.2FA' />
            </h3>
            <p className='header_description'>
              <FormattedMessage id='dashboard.settings.2FADescription' />
            </p>
          </div>
          <div className='col-12 col-md-4 text-center text-md-right'>
            <Button
              onClick={() => this.on2FAToggleRequestOpen()} className='dashboard-btn dashboard-btn--white'>
              {twoFaEnabled ?
                <FormattedMessage id='dashboard.settings.btnDisable' /> :
                <FormattedMessage id='dashboard.settings.btnEnable' />
              }
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsContainer;