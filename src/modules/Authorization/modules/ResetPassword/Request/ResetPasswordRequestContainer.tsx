import * as React from 'react';
import { observer } from 'mobx-react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { lazyInject } from '../../../../IoC';
import { ResetPasswordRequestStore } from './ResetPasswordRequestStore';
import RequestResetPassword from './Modal/RequestResetPassword';
import RequestResetPasswordLinkSent from './Modal/RequestResetPasswordLinkSent';

@observer
class ResetPasswordRequestContainer extends React.Component<{} & InjectedIntlProps> {
  @lazyInject(ResetPasswordRequestStore)
  store: ResetPasswordRequestStore;

  componentWillUnmount() {
    this.store.reset();
  }

  onSubmit = (email: string, captcha: string) => {
    const payload = { email, captcha };
    this.store.request(payload);
  };

  onChange = () => {
    this.store.reset();
  };

  render() {
    const { intl } = this.props;

    const { isEmailNotFound, isEmailIncorrect, isCaptchaIncorrect, isSent, captchaMustBeReload } = this.store;

    const emailErrorMessage = !isEmailNotFound
      ? intl.formatMessage({id: 'authorization.validation.incorrectEmail'})
      : intl.formatMessage({id: 'authorization.validation.emailNotFound'});

    return (
      <div>
        <RequestResetPassword isOpen={!isSent}
                              onSubmit={this.onSubmit}
                              onChange={this.onChange}
                              emailErrorMessage={emailErrorMessage}
                              showEmailError={isEmailIncorrect || isEmailNotFound}
                              showCaptchaError={isCaptchaIncorrect}
                              captchaMustBeReload={captchaMustBeReload}
        />

        <RequestResetPasswordLinkSent isOpen={isSent} />
      </div>
    );
  }
}

export default injectIntl(ResetPasswordRequestContainer);