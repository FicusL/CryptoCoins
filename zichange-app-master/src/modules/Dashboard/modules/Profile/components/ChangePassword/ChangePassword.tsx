import * as React from 'react';
import Modal from '../../../../../../modules/Shared/components/Modal/ModalBase';
import Input from '../../../../../Shared/components/Inputs/Input';
import Button from '../../../../../Shared/components/Buttons/Button';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import PasswordRequirements from '../../../../../Shared/components/PasswordRequirements/PasswordRequirements';
import InputPassword from '../../../../../Shared/components/Inputs/InputPassword';

export interface IChangePasswordErrors {
  isOldPasswordIncorrect: boolean;
  isOldPasswordWrong: boolean;

  isPasswordIncorrect: boolean;
  isOldPasswordEqual: boolean;

  is2FACodeIncorrect: boolean;
  is2FACodeWrong: boolean;
}

interface IProps {
  onSubmit: (oldPassword: string, password: string, code2FA: string) => void;
  onRequestResetErrors: () => void;
  onRequestClose: () => void;

  isOpen: boolean;
  show2FA?: boolean;

  errors: IChangePasswordErrors;
}

class ChangePassword extends React.Component<IProps & InjectedIntlProps > {
  state = { oldPassword: '', password: '', confirmPassword: '', code2FA: '', passwordsNotMatch: false };

  handleChange = ({ name, value }) => {
    this.setState({ [name]: value });
    this.setState({ passwordsNotMatch: false });
    this.props.onRequestResetErrors();
  };

  handleSubmit = e => {
    e.preventDefault();
    const { oldPassword, password, confirmPassword, code2FA } = this.state;

    const passwordsNotMatch = password !== confirmPassword;
    this.setState({ passwordsNotMatch });

    if (passwordsNotMatch) {
      return;
    }

    this.props.onSubmit(oldPassword, password, code2FA);
  };

  public render() {
    const { intl, isOpen, onRequestClose, show2FA } = this.props;
    const { password, passwordsNotMatch } = this.state;

    const { isOldPasswordIncorrect, isOldPasswordWrong } = this.props.errors;
    const { isPasswordIncorrect, isOldPasswordEqual } = this.props.errors;
    const { is2FACodeIncorrect, is2FACodeWrong } = this.props.errors;

    const oldPasswordErrorMessage = isOldPasswordWrong
      ? intl.formatMessage({ id: 'dashboard.settings.changePassword.validation.oldPasswordWrong' })
      : intl.formatMessage({ id: 'dashboard.settings.changePassword.validation.oldPasswordIncorrect' });

    const passwordErrorMessage = isOldPasswordEqual
      ? intl.formatMessage({ id: 'dashboard.settings.changePassword.validation.oldPasswordEqual' })
      : intl.formatMessage({ id: 'dashboard.settings.changePassword.validation.passwordIncorrect' });

    const repeatPasswordErrorMessage =
      intl.formatMessage({ id: 'dashboard.settings.changePassword.validation.passwordsNotMatch' });

    const twoFAErrorMessage = is2FACodeWrong
      ? intl.formatMessage({ id: 'dashboard.settings.changePassword.validation.2FACodeWrong' })
      : intl.formatMessage({ id: 'dashboard.settings.changePassword.validation.2FACodeIncorrect' });

    return (
      <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
        <Modal.Title>
          {intl.formatMessage({
            id: 'dashboard.settings.changePassword.title',
          })}
        </Modal.Title>
        <form onSubmit={this.handleSubmit}>
          <InputPassword
            name='oldPassword'
            label={intl.formatMessage({
              id: 'dashboard.settings.changePassword.oldPassword',
            })}
            placeholder={intl.formatMessage({
              id: 'dashboard.settings.changePassword.oldPasswordPlaceholder',
            })}
            errorMessage={oldPasswordErrorMessage}
            showError={isOldPasswordWrong || isOldPasswordIncorrect}
            onChange={this.handleChange}
            showSwitcher
          />

          <InputPassword
            name='password'
            label={intl.formatMessage({
              id: 'dashboard.settings.changePassword.password',
            })}
            placeholder={intl.formatMessage({
              id: 'dashboard.settings.changePassword.passwordPlaceholder',
            })}
            errorMessage={passwordErrorMessage}
            showError={isPasswordIncorrect || isOldPasswordEqual}
            onChange={this.handleChange}
            showSwitcher
          />

          <InputPassword
            name='confirmPassword'
            label={intl.formatMessage({
              id: 'dashboard.settings.changePassword.passwordConfirm',
            })}
            placeholder={intl.formatMessage({
              id: 'dashboard.settings.changePassword.passwordConfirmPlaceholder',
            })}
            errorMessage={repeatPasswordErrorMessage}
            showError={passwordsNotMatch}
            onChange={this.handleChange}
            showSwitcher
          />

          <PasswordRequirements password={password} />

          {show2FA &&
            <Input
              name='code2FA'
              type='text'
              label={intl.formatMessage({
                id: 'dashboard.settings.changePassword.code2FA',
              })}
              placeholder={intl.formatMessage({
                id: 'dashboard.settings.changePassword.code2FAPlaceholder',
              })}
              errorMessage={twoFAErrorMessage}
              showError={is2FACodeIncorrect || is2FACodeWrong}
              onChange={this.handleChange}
            />
          }

          <Button type='submit' className='dashboard-btn--modal'>
            {intl.formatMessage({
              id: 'dashboard.settings.changePassword.changePasswordBtn',
            })}
          </Button>
        </form>
      </Modal>
    );
  }
}

export default injectIntl(ChangePassword);