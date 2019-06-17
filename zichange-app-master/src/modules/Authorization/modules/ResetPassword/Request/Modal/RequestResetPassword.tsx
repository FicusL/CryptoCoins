import * as React from 'react';
import Input from '../../../../../Shared/components/Inputs/Input';
import Button from '../../../../../Shared/components/Buttons/Button';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import Modal from '../../../../../../modules/Shared/components/Modal/ModalBase';
import ReCaptcha from '../../../../../Shared/components/ReCaptcha/ReCaptcha';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { ResetPasswordRequestStore } from '../ResetPasswordRequestStore';

export interface IRequestResetProps {
  isOpen: boolean;
  onSubmit: (email: string, captcha: string) => void;
  onChange: (name: string, value: string) => void;
  emailErrorMessage?: string;
  showEmailError?: boolean;
  showCaptchaError?: boolean;
  captchaMustBeReload?: boolean;
}

@observer
class RequestResetPassword extends React.Component<IRequestResetProps & InjectedIntlProps> {
  state = { email: '', captcha: '' };

  @lazyInject(ResetPasswordRequestStore)
  store: ResetPasswordRequestStore;

  handleChange = ({name, value}) => {
    this.store.flushCaptcha();

    this.setState({[name]: value} as any);
    this.props.onChange(name, value);
  };

  componentWillUnmount(): void {
    this.store.reset();
    this.store.resetCaptcha();
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { email, captcha } = this.state;
    this.props.onSubmit(email, captcha);
  };

  render() {
    const { intl } = this.props;
    const { email  } = this.state;

    return (
      <div>
        <Modal isOpen={this.props.isOpen} hideCloseIcon disableOverlay>
          <Modal.Title>
            <FormattedMessage id='authorization.resetYourPassword' />
          </Modal.Title>
          <p className='text-center'>
            <FormattedMessage id='authorization.resetPasswordTip' />
          </p>
          <form onSubmit={this.onSubmit}>
            <Input
              name='email'
              type='email'
              placeholder={intl.formatMessage({
                id: 'authorization.emailPlaceholder',
              })}
              errorMessage={this.props.emailErrorMessage}
              showError={this.props.showEmailError}
              onChange={this.handleChange}
              value={email}
            />

            <div className={classNames(this.props.showEmailError ? 'mt-4' : '')}>
              <ReCaptcha
                name='captcha'
                onChange={this.handleChange}
                errorMessage={'Can\'t validate captcha'}
                showError={this.props.showCaptchaError}
                resetByProps={this.props.captchaMustBeReload}
              />
            </div>


            <Button className='dashboard-btn dashboard-btn--modal font-responsive' type='submit'>
              <FormattedMessage id='authorization.resetPassword' />
            </Button>

            <p className='modal__login_sign-up no-margin text-center mt-3'>
              <Link to='/login'>
                <FormattedMessage id='authorization.backToLogin' />
              </Link>
            </p>
          </form>
        </Modal>
      </div>
    );
  }
}

export default injectIntl(RequestResetPassword);