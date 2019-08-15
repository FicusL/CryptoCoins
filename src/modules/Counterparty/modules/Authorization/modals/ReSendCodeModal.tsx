import * as React from 'react';
import Button from '../../../../Shared/components/Buttons/Button';
import { IOnChangeProps } from '../../../../Shared/types/IChangeProps';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../IoC';
import { ActiveAccountStore } from '../stores/ActiveAccountStore';
import ReCaptcha from '../../../../Shared/components/ReCaptcha/ReCaptcha';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { ColorStore } from '../../../../Admin/modules/Counterparty/stores/Colors/ColorStore';

interface IProps {
  onClose?: () => void;
}

@observer
class ReSendCodeModal extends React.Component<IProps & InjectedIntlProps> {

  @lazyInject(ActiveAccountStore)
  activateAccountStore: ActiveAccountStore;

  @lazyInject(ColorStore)
  color: ColorStore;

  state = {
    captcha: '',
  };

  componentWillUnmount(): void {
    this.activateAccountStore.reset();
    this.activateAccountStore.resetCaptcha();
  }

  resendHandler = () => {
    if (!this.activateAccountStore.isCaptchaIncorrect) {
      this.activateAccountStore.resendCode(this.state.captcha);
    }
  };

  onCloseHandler = () => {
    this.activateAccountStore.isReSendCode = false;
  };

  captchaHandler = ({name, value}: IOnChangeProps) => {
    this.activateAccountStore.flushCaptcha();

    this.setState({[name]: value});
  };

  render() {

    const { isCaptchaIncorrect, captchaMustBeReload } = this.activateAccountStore;
    const { intl } = this.props;

    return(
      <div className='modal mt-5'>
        <h2 className='modal__title'>
          {intl.formatMessage({
            id: 'counterparties.resendCode.header',
            defaultMessage: 'Get the code',
          })}
        </h2>
        <p className='mb-3'>
          {intl.formatMessage({
            id: 'counterparties.resendCode.content',
            defaultMessage: 'If you didn\'t receive the code, click the button below to resend an email',
          })}
        </p>
        <ReCaptcha
          name='captcha'
          onChange={this.captchaHandler}
          errorMessage={'Can\'t validate captcha'}
          showError={isCaptchaIncorrect}
          resetByProps={captchaMustBeReload}
        />

        <div className='d-flex justify-content-between mt-3'>
          <Button className='dashboard-btn dashboard-btn--modal m-0 col-5' onClick={this.onCloseHandler}
                  colors={this.color.styles.button}>
            {intl.formatMessage({
              id: 'counterparties.resendCode.back',
              defaultMessage: 'Back',
            })}
          </Button>
          <Button className='dashboard-btn dashboard-btn--modal m-0 col-5' onClick={this.resendHandler}
                  colors={this.color.styles.button}>
            {intl.formatMessage({
              id: 'counterparties.resendCode.resend',
              defaultMessage: 'Resend',
            })}
          </Button>
        </div>
      </div>
    );
  }
}

export default injectIntl(ReSendCodeModal);
