import * as React from 'react';
import { observer } from 'mobx-react';
import Input from '../../../../Shared/components/Inputs/Input';
import InputPassword from '../../../../Shared/components/Inputs/InputPassword';
import PasswordRequirements from '../../../../Shared/components/PasswordRequirements/PasswordRequirements';
import Button from '../../../../Shared/components/Buttons/Button';
import { ResetPasswordChangeStore } from './ResetPasswordChangeStore';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { lazyInject } from '../../../../IoC';

import ResetPasswordSuccess from './Modal/ResetPasswordSuccess';

import '../style.scss';

interface IResetPasswordChangeContainerProps {
  token: string;
}

@observer
class ResetPasswordChangeContainer extends React.Component<IResetPasswordChangeContainerProps & InjectedIntlProps> {
  state = { password: '', confirmPassword: '', passwordMatch: true };

  @lazyInject(ResetPasswordChangeStore)
  private readonly store: ResetPasswordChangeStore;

  componentDidMount() {
    this.store.getTokenData(this.props.token);
  }

  handleChange = ({name, value}) => {
    this.setState({ [name]: value });
    this.store.resetPasswordStatus();
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { password, confirmPassword } = this.state;

    if (password.length < 1) {
      return;
    }

    const passwordMatch = password === confirmPassword;
    this.setState({ passwordMatch });
    if (!passwordMatch) {
      return;
    }

    const { token } = this.props;
    this.store.updatePassword(token, password);
  };

  handleSubmitSuccessFrom = async (e) => {
    e.preventDefault();

    await this.store.loginByResetToken(this.props.token);
    window.location.pathname = '/dashboard';
  };

  render() {
    const { intl } = this.props;

    const { password, passwordMatch } = this.state;
    const { isLoaded, isTokenValid, tokenEmail, isSent, isPasswordIncorrect } = this.store;

    return (
      <div style={{ marginTop: '50px' }} className='layout'>
        <ResetPasswordSuccess isOpen={isSent} onSubmit={this.handleSubmitSuccessFrom} />

        { isLoaded && !isSent && <section className='reset-password'>
          <div className='container'>
            {!isTokenValid ?
              <h3 className='header'>
                <FormattedMessage id='authorization.validation.invalidResetLink' />
              </h3>
              :
              <form onSubmit={this.handleSubmit}>
                <div className='row reset-password__divider'>
                  <div className='col-md'>
                    <Input name='email' label='Email' value={tokenEmail} onChange={() => null} disabled/>
                  </div>
                  <div className='col-md'>
                    <InputPassword
                      name='password'
                      label={intl.formatMessage({
                        id: 'authorization.password',
                      })}
                      placeholder={intl.formatMessage({
                        id: 'authorization.passwordPlaceholder',
                      })}
                      errorMessage={intl.formatMessage({
                        id: 'authorization.validation.incorrectPassword',
                      })}
                      autoComplete='new-reset-password'
                      showError={isPasswordIncorrect}
                      onChange={this.handleChange}
                      showSwitcher
                    />

                    <InputPassword
                      name='confirmPassword'
                      label={intl.formatMessage({
                        id: 'authorization.passwordConfirm',
                      })}
                      placeholder={intl.formatMessage({
                        id: 'authorization.passwordConfirmPlaceholder',
                      })}
                      errorMessage={intl.formatMessage({
                        id: 'authorization.validation.passwordsDoNotMatch',
                      })}
                      autoComplete='new-reset-password'
                      showError={!passwordMatch}
                      onChange={this.handleChange}
                      showSwitcher
                    />

                    <PasswordRequirements password={password}/>
                  </div>
                </div>
                <div className='text-right'>
                  <Button type='submit' className='dashboard-btn' name='white'>
                    <FormattedMessage id='authorization.resetPassword' />
                  </Button>
                </div>
            </form>
          }
          </div>
        </section> }
      </div>
    );
  }
}

export default injectIntl(ResetPasswordChangeContainer);