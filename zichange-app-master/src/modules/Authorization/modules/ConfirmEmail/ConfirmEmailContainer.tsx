import * as React from 'react';
import Modal from '../../../Shared/components/Modal/ModalBase';
import { injectIntl } from 'react-intl';
import { ConfirmEmailStore } from './ConfirmEmailStore';
import { lazyInject } from '../../../IoC';
import Button from '../../../Shared/components/Buttons/Button';
import { observer } from 'mobx-react';
import ModalSuccess from '../../../Shared/components/Modal/Success';
import ReCaptcha from '../../../Shared/components/ReCaptcha/ReCaptcha';
import { SessionStore } from '../../../Shared/stores/SessionStore';

interface IState {
  captcha: string;
}

interface IProps {
  intl: ReactIntl.InjectedIntl;
}

@observer
class ConfirmEmailContainer extends React.Component<IProps, IState> {
  refreshInterval: number;

  @lazyInject(ConfirmEmailStore)
  readonly store: ConfirmEmailStore;

  @lazyInject(SessionStore)
  readonly sessionStore: SessionStore;

  constructor(props) {
    super(props);
    this.state = {
      captcha: '',
    };
  }

  handleChange = ({ name, value }) => {
    this.setState({ [name]: value } as any);
    this.store.reset();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.store.resendConfirmation(this.state.captcha);
  };

  componentWillMount(): void {
    this.refreshInterval = setInterval(() =>
      this.sessionStore.refresh(true), 3000) as unknown as number;
  }

  componentWillUnmount(): void {
    clearInterval(this.refreshInterval);
  }

  public render() {
    const { intl } = this.props;

    return (
      <Modal isOpen disableOverlay hideCloseIcon>
        <Modal.Title>
          {intl.formatMessage({ id: 'authorization.confirmEmail.title' })}
        </Modal.Title>

        <p className='modal-note'>
          {intl.formatMessage({ id: 'authorization.confirmEmail.text' })}
        </p>

        <form onSubmit={this.handleSubmit}>
          <ReCaptcha
            name='captcha'
            onChange={this.handleChange}
            errorMessage={'Can\'t validate captcha'}
            showError={this.store.isCaptchaIncorrect}
            resetByProps={this.store.isCaptchaIncorrect}
          />

          <Button className='dashboard-btn dashboard-btn--modal' type='submit'>
            {intl.formatMessage({ id: 'authorization.confirmEmail.resend' })}
          </Button>
        </form>

        <ModalSuccess
          isOpen={this.store.isSent}
          title={intl.formatMessage({ id: 'authorization.confirmEmail.sent' })}
          onClose={() => this.store.reset()}
        />

      </Modal>
    );
  }
}

export default injectIntl(ConfirmEmailContainer);