import * as React from 'react';
import Modal from '../../../../../Shared/components/Modal/ModalBase';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import Button from '../../../../../Shared/components/Buttons/Button';
import Input from '../../../../../Shared/components/Inputs/Input';
import InputPassword from '../../../../../Shared/components/Inputs/InputPassword';

export interface IEnable2FAErrors {
  isPasswordIncorrect: boolean;
  isPasswordWrong: boolean;
  is2FACodeIncorrect: boolean;
  is2FACodeWrong: boolean;
}

interface IProps {
  onSubmit: (password: string, code: string) => void;
  onRequestClose: () => void;
  onRequestErrorsReset: () => void;
  isOpen: boolean;
  email: string;
  secret?: string;
  QRCode?: string;
  errors: IEnable2FAErrors;
}

class Enable2FA extends React.Component<IProps & InjectedIntlProps> {
  state = { password: '', code: '' };

  handleChange = ({ name, value }) => {
    this.setState({ [name]: value });
    this.props.onRequestErrorsReset();
  };

  printCode = () => {
    const recoveryKeyElement = document.getElementById('print-recovery-key');
    if (!recoveryKeyElement) {
      return;
    }

    const content = recoveryKeyElement.innerHTML;
    const newWindow = window.open();
    if (!newWindow) {
      return;
    }

    newWindow.document.write(content);
    newWindow.print();
    newWindow.close();
  };

  handleSubmit = e => {
    e.preventDefault();
    const { password, code } = this.state;
    this.props.onSubmit(password, code);
  };

  public render() {
    const { intl, isOpen, onRequestClose, email, QRCode, secret } = this.props;

    const { isPasswordIncorrect, isPasswordWrong } = this.props.errors;
    const { is2FACodeIncorrect, is2FACodeWrong } = this.props.errors;

    const passwordErrorMessage = isPasswordWrong
      ? intl.formatMessage({ id: 'dashboard.settings.2fa.enable.validation.wrong.password' })
      : intl.formatMessage({ id: 'dashboard.settings.2fa.enable.validation.incorrect.password' });

    const twoFAErrorMessage = is2FACodeWrong
      ? intl.formatMessage({ id: 'dashboard.settings.2fa.enable.validation.wrong.code' })
      : intl.formatMessage({ id: 'dashboard.settings.2fa.enable.validation.incorrect.code' });

    return (
      <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
        <div id='print-recovery-key' className='d-none'>
          {intl.formatMessage({ id: 'dashboard.settings.2fa.enable.recovery.key' })}: {secret}
        </div>
        <Modal.Title>
          {intl.formatMessage({
            id: 'dashboard.settings.2fa.enable.title',
            defaultMessage: 'Enable 2FA',
          })}
        </Modal.Title>

        <form onSubmit={this.handleSubmit}>
          <label className='form__label'>{intl.formatMessage({
            id: 'dashboard.settings.2fa.enable.email',
            defaultMessage: 'Email',
          })}
          </label>
          <p className='form__static'>{email}</p>

          <InputPassword
            name='password'
            label={intl.formatMessage({
              id: 'dashboard.settings.2fa.enable.password',
              defaultMessage: 'Password',
            })}
            placeholder={intl.formatMessage({
              id: 'dashboard.settings.2fa.enable.password.placeholder',
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
              id: 'dashboard.settings.2fa.enable.code',
              defaultMessage: 'Code',
            })}
            placeholder={intl.formatMessage({
              id: 'dashboard.settings.2fa.enable.code.placeholder',
              defaultMessage: 'Enter code',
            })}
            errorMessage={twoFAErrorMessage}
            showError={is2FACodeIncorrect || is2FACodeWrong}
            onChange={this.handleChange}
          />

          <div className='row no-gutters'>
            <div className='col-5'>
              <img src={QRCode} />
            </div>
            <div className='col'>
              <div className='modal__enable2fa__secret-container'>
                <p>
                  {intl.formatMessage({ id: 'dashboard.settings.2fa.enable.secret.key' })}
                  <br/>
                  <b className='text--bold'>{secret}</b><br/>
                  <span className='modal__enable2fa__secret-print' onClick={this.printCode}>
                    {intl.formatMessage({ id: 'dashboard.settings.2fa.enable.print.backup' })}
                  </span>
                </p>
                <p className='modal__enable2fa__secret-note'>
                  {intl.formatMessage({ id: 'dashboard.settings.2fa.enable.note' })}
                </p>
              </div>
            </div>
          </div>

          <div className='whatIs2fa'>
            <a target='_blank' href={`${window.location.origin}/2fa-info`}>
              <FormattedMessage id='authorization.2fa.whatIs2fa'/>
            </a>
          </div>

          <Button type='submit' className='dashboard-btn--modal'>
            {intl.formatMessage({ id: 'dashboard.settings.2fa.enable.btn.enable' })}
          </Button>
        </form>
      </Modal>
    );
  }
}

export default injectIntl(Enable2FA);