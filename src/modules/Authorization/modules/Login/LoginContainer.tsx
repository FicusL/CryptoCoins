import * as React from 'react';
import Input from '../../../Shared/components/Inputs/Input';
import Modal from '../../../Shared/components/Modal/ModalBase';
import Button from '../../../Shared/components/Buttons/Button';
import ReCaptcha from '../../../Shared/components/ReCaptcha/ReCaptcha';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { ILoginPayload, LoginStore } from './LoginStore';
import { lazyInject } from '../../../IoC';
import { FormattedMessage, injectIntl } from 'react-intl';
import { IOnChangeProps } from '../../../Shared/types/IChangeProps';

interface IProps extends RouteComponentProps {
  intl: ReactIntl.InjectedIntl;
}

interface ILoginContainerState {
  email: string;
  password: string;
  captcha: string;
}

@observer
class LoginContainer extends React.Component<IProps, ILoginContainerState> {
  @lazyInject(LoginStore)
  readonly loginStore: LoginStore;

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      captcha: '',
    };
  }

  componentWillUnmount() {
    this.loginStore.reset();
    this.loginStore.resetCaptcha();
  }

  handleChange = ({name, value}: IOnChangeProps) => {
    this.loginStore.flushCaptcha();

    this.setState({[name]: value} as any);
    this.loginStore.reset();
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.loginStore.flushCaptcha();

    const { email, password, captcha } = this.state;
    const payload = { email, password, captcha } as ILoginPayload;
    this.loginStore.loginAttempt(payload);
  };

  handleClose = () => {
    this.props.history.push('/');
  };

  render() {
    const { isCaptchaIncorrect, isEmailIncorrect, isPasswordIncorrect, captchaMustBeReload } = this.loginStore;
    const { intl } = this.props;

    return (
      <Modal isOpen disableOverlay className='modal__login' onRequestClose={this.handleClose}>
        <h2 className='modal__title'>
          <FormattedMessage id='authorization.signIn' defaultMessage='Login' />
        </h2>
        <form onSubmit={this.handleSubmit}>
          <Input
            name='email'
            autoComplete='current-email'
            label={intl.formatMessage({
              id: 'authorization.email',
              defaultMessage: 'Email',
            })}
            placeholder={intl.formatMessage({
              id: 'authorization.emailPlaceholder',
              defaultMessage: 'Enter your email',
            })}
            errorMessage={intl.formatMessage({
              id: 'authorization.validation.incorrectEmail',
              defaultMessage: 'Incorrect email',
            })}

            onChange={this.handleChange}
            showError={isEmailIncorrect}
          />

          <Input
            name='password'
            type='password'
            autoComplete='current-password'
            label={intl.formatMessage({
              id: 'authorization.password',
              defaultMessage: 'Password',
            })}
            placeholder={intl.formatMessage({
              id: 'authorization.passwordPlaceholder',
              defaultMessage: 'Enter your password',
            })}
            errorMessage={intl.formatMessage({
              id: 'authorization.validation.incorrectPassword',
              defaultMessage: 'Incorrect password',
            })}

            onChange={this.handleChange}
            showError={isPasswordIncorrect}
          />

          <div className='text-right mb-3' id='uniq_reset'>
            <span className='modal__login_reset-password'>
              <Link to='/reset_password'>
                <FormattedMessage id='authorization.resetPassword' defaultMessage='Reset password'/>
              </Link>
            </span>
          </div>

          <ReCaptcha
            name='captcha'
            onChange={this.handleChange}
            errorMessage={'Can\'t validate captcha'}
            showError={isCaptchaIncorrect}
            resetByProps={captchaMustBeReload}
          />

          <Button className='dashboard-btn dashboard-btn--modal' type='submit'>
            <FormattedMessage id='authorization.signIn' defaultMessage='Login' />
          </Button>
        </form>

        <p className='modal__login_sign-up no-margin text-center mt-3'>
          <FormattedMessage id='authorization.noAccount' defaultMessage={'Don\'t have an account?'} />
          <br/>
          <Link to='/register'>
            <FormattedMessage id='authorization.signUp' defaultMessage='Sign up!' />
          </Link>
        </p>
      </Modal>
    );
  }

}

export default injectIntl(withRouter(LoginContainer));
