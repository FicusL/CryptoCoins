import * as React from 'react';
import Input from '../../../../Shared/components/Inputs/Input';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Button from '../../../../Shared/components/Buttons/Button';
import { lazyInject } from '../../../../IoC';
import { TransactionProgressStore } from '../../../components/TransactionProgess/stores/TransactionProgressStore';
import './style.scss';
import { ActiveAccountStore } from '../stores/ActiveAccountStore';
import { ModalStore } from '../../../../Modals/store/ModalStore';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import ReSendCodeModal from './ReSendCodeModal';
import { CounterpartyAccountStore } from '../../../stores/CounterpartyAccountStore';
import { ColorStore } from '../../../../Admin/modules/Counterparty/stores/Colors/ColorStore';

interface IProps {
  onClose?: () => void;
}

@observer
class AuthorizationModal extends React.Component<IProps & InjectedIntlProps> {

  @lazyInject(TransactionProgressStore)
  store: TransactionProgressStore;

  @lazyInject(ActiveAccountStore)
  activateAccountStore: ActiveAccountStore;

  @lazyInject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  @lazyInject(ColorStore)
  color: ColorStore;

  @lazyInject(ModalStore)
  modalStore: ModalStore;

  @observable code : string = '';

  componentWillMount(): void {
    this.counterpartyAccountStore.sendCode();

    if (this.counterpartyAccountStore.activateCode) {
      this.activateAccountStore.activateAccount(this.counterpartyAccountStore.activateCode)
        .then(() => {
          this.store.currentStep();
        });
    }
  }

  componentWillUnmount(): void {
    this.activateAccountStore.reset();
  }

  handleChange = (e) => {
    this.code = e.value;
  };

  resendHandler = () => {
    this.activateAccountStore.isReSendCode = true;
  };

  onSubmitHandler = (e) => {
    e.preventDefault();

    const payload = this.code.replace(/ /g, '');

    if (payload.length < 6) {
      this.activateAccountStore.isCodeIncorrect = true;
      this.activateAccountStore.codeError = 'code must be longer than or equal to 6 characters';
    } else {
      this.activateAccountStore.activateAccount(payload).then(() => {
        this.store.currentStep();
      });
    }
  };

  render() {

    const { intl } = this.props;

    return(
      <>
        {this.activateAccountStore.isReSendCode ?
          <ReSendCodeModal /> :
          <div className='modal mt-5'>
            <h2 className='modal__title'>
              {intl.formatMessage({
                id: 'counterparties.authorization.header',
                defaultMessage: 'We have sent a confirmation code to your email.',
              })}
            </h2>

            <form onSubmit={this.onSubmitHandler}>
              <Input
                label={intl.formatMessage({
                  id: 'counterparties.authorization.label',
                  defaultMessage: 'Enter a 6-digit code',
                })}
                placeholder='_ _ _ _ _ _'
                autoFocus
                autoComplete='off'
                name='SpecialAuthorizationCode'
                type='text'
                onChange={this.handleChange}
                value={this.code}
                showError={this.activateAccountStore.isCodeIncorrect}
                errorMessage={intl.formatMessage({
                  id: 'counterparties.authorization.codeWrongOrExpired',
                  defaultMessage: 'The code is wrong or expired',
                })}
                mask='* * * * * *'
                maskChar={null}
                inputClassNames='text-center'
              />

              <div className='whatIs2fa'>
                <a className='resend' onClick={this.resendHandler}>
                  {intl.formatMessage({
                    id: 'counterparties.authorization.resendCode',
                    defaultMessage: 'Didn\'t receive an email?',
                  })}
                </a>
              </div>

              <Button className='dashboard-btn dashboard-btn--modal m-0'
                      type='submit'
                      colors={this.color.styles.button}>
                ОК
              </Button>

            </form>
          </div>
        }
      </>
    );
  }
}

export default injectIntl(AuthorizationModal);