import * as React from 'react';
import Modal from '../../../../../Shared/components/Modal/ModalBase';
import Input from '../../../../../Shared/components/Inputs/Input';
import Button from '../../../../../Shared/components/Buttons/Button';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import InputPassword from '../../../../../Shared/components/Inputs/InputPassword';

export interface IDisable2FAErrors {
  isPasswordIncorrect: boolean;
  isPasswordWrong: boolean;
  is2FACodeIncorrect: boolean;
  is2FACodeWrong: boolean;
}

interface IProps {
  onSubmit: (password: string, code: string) => void;
  onRequestClose: () => void;
  onRequestErrorsReset: () => void;
  errors: IDisable2FAErrors;
  isOpen: boolean;
  email: string;
  isPasswordIncorrect?: boolean;
  isPasswordWrong?: boolean;
  is2FACodeIncorrect?: boolean;
  is2FACodeWrong?: boolean;
}

class Disable2FA extends React.Component<IProps & InjectedIntlProps> {
  state = { password: '', code: '' };

  handleChange = ({ name, value }) => {
    this.setState({ [name]: value });
    this.props.onRequestErrorsReset();
  };

  handleSubmit = e => {
    e.preventDefault();
    const { password, code } = this.state;
    this.props.onSubmit(password, code);
  };

  public render() {
    const { intl, isOpen, onRequestClose, email } = this.props;

    const { isPasswordIncorrect, isPasswordWrong } = this.props.errors;
    const { is2FACodeIncorrect, is2FACodeWrong } = this.props.errors;

    const passwordErrorMessage = isPasswordWrong
      ? intl.formatMessage({ id: 'dashboard.settings.2fa.disable.validation.wrong.password' })
      : intl.formatMessage({ id: 'dashboard.settings.2fa.disable.validation.incorrect.password' });

    const twoFAErrorMessage = is2FACodeWrong
      ? intl.formatMessage({ id: 'dashboard.settings.2fa.disable.validation.wrong.code' })
      : intl.formatMessage({ id: 'dashboard.settings.2fa.disable.validation.incorrect.code' });

    return (
      <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
        <Modal.Title>
          {intl.formatMessage({
            id: 'dashboard.settings.2fa.disable.title',
            defaultMessage: 'Disable 2FA',
          })}
        </Modal.Title>

        <form onSubmit={this.handleSubmit}>
          <label className='form__label'>
            {intl.formatMessage({
              id: 'dashboard.settings.2fa.disable.email',
              defaultMessage: 'Email',
            })}
          </label>

          <p className='form__static'>
            {email}
          </p>

          <InputPassword
            name='password'
            label={intl.formatMessage({
              id: 'dashboard.settings.2fa.disable.password',
              defaultMessage: 'Password',
            })}
            placeholder={intl.formatMessage({
              id:  'dashboard.settings.2fa.disable.password.placeholder',
              defaultMessage: 'Enter your password',
            })}
            errorMessage={passwordErrorMessage}
            showError={isPasswordIncorrect || isPasswordWrong}
            onChange={this.handleChange}
            showSwitcher
          />

          <Input
            name='code'
            label={intl.formatMessage({
              id: 'dashboard.settings.2fa.disable.code',
              defaultMessage: 'Code',
            })}
            placeholder={intl.formatMessage({
              id: 'dashboard.settings.2fa.disable.code.placeholder',
              defaultMessage: 'Enter code',
            })}
            errorMessage={twoFAErrorMessage}
            showError={is2FACodeIncorrect || is2FACodeWrong}
            onChange={this.handleChange}
          />

          <Button type='submit' className='dashboard-btn--modal'>
            {intl.formatMessage({
              id: 'dashboard.settings.2fa.disable.btn.enable',
              defaultMessage: 'Disable 2FA',
            })}
          </Button>
        </form>
      </Modal>
    );
  }
}

export default injectIntl(Disable2FA);