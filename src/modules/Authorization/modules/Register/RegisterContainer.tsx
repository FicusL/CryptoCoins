import * as React from 'react';
import Input from '../../../Shared/components/Inputs/Input';
import Password from '../../../Shared/components/Inputs/InputPassword';
import Modal from '../../../Shared/components/Modal/ModalBase';
import Button from '../../../Shared/components/Buttons/Button';
import { Link, withRouter } from 'react-router-dom';
import PasswordRequirements from '../../../Shared/components/PasswordRequirements/PasswordRequirements';
import { observer } from 'mobx-react';
import { IRegisterPayload, RegisterStore } from './RegisterStore';
import { lazyInject } from '../../../IoC';
import '../../../Shared/style/responsive.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import ReCaptcha from '../../../Shared/components/ReCaptcha/ReCaptcha';
import { ModalStore } from '../../../Modals/store/ModalStore';
import RadioButton from '../../../Shared/components/Inputs/RadioButton/RadioButton';
import { AccountType } from '../../../Shared/const/AccountType';
import CheckBox from '../../../Shared/components/Inputs/Checkbox/Checkbox';
import { InviteCodesStore } from './InviteCodesStore';
import { RouteComponentProps } from 'react-router';
import withScrollToError, { IScrollToErrorProps } from '../../../Shared/utils/WithScrollToError';
import { ComponentClass } from 'react';
import { observable } from 'mobx';
import { LocaleStore } from '../../../Shared/stores/LocaleStore';
import classNames from 'classnames';

interface IState {
  email: string;
  password: string;
  captcha: string;
  type: string;
  invite_code: string;
  PrivacyPolicy: boolean;
  TermsOfUse: boolean;
  RefundPolicy: boolean;
  PrivacyPolicyError: boolean;
  TermsOfUseError: boolean;
  RefundPolicyError: boolean;
  typeShowError: boolean;
  referralToken: string;
}

interface IProps extends RouteComponentProps {
  intl: ReactIntl.InjectedIntl;
  invite_code?: string;
  referralToken?: string;
}

@observer
class RegisterContainer extends React.Component<IProps & IScrollToErrorProps, IState> {
  @lazyInject(RegisterStore)
  readonly registerStore: RegisterStore;

  @lazyInject(InviteCodesStore)
  readonly inviteCodeStore: InviteCodesStore;

  @lazyInject(ModalStore)
  readonly modalStore: ModalStore;

  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  @observable isNatural : boolean = true;

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      captcha: '',
      type: 'natural',
      invite_code: props.invite_code || '',
      referralToken: props.referral || '',
      PrivacyPolicy: false,
      TermsOfUse: false,
      RefundPolicy: false,
      PrivacyPolicyError: false,
      TermsOfUseError: false,
      RefundPolicyError: false,
      typeShowError: false,
    };
  }

  componentWillUnmount() {
    this.registerStore.reset();
    this.registerStore.resetCaptcha();
  }

  handleChange = ({name, value}) => {
    this.registerStore.flushCaptcha();

    if (value === AccountType.Natural || value === AccountType.LegalEntity) {
      this.isNatural = value === 'natural';
    }

    this.setState({ [name]: value,
      typeShowError: false, PrivacyPolicyError: false, TermsOfUseError: false, RefundPolicyError: false,
    } as any);

    this.registerStore.reset();
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.registerStore.flushCaptcha();

    const { email, password, captcha, type, invite_code,
      referralToken, PrivacyPolicy, TermsOfUse, RefundPolicy } = this.state;

    if (!type || !PrivacyPolicy || !TermsOfUse || !RefundPolicy) {
      const typeShowError = !type;

      const PrivacyPolicyError = !PrivacyPolicy;
      const TermsOfUseError = !TermsOfUse;
      const RefundPolicyError = !RefundPolicy;

      this.setState({ PrivacyPolicyError });
      this.setState({ TermsOfUseError });
      this.setState({ RefundPolicyError });

      this.setState({ typeShowError });

      if (this.props.scrollToError) {
        this.props.scrollToError();
      }

      return;
    }

    const payload = { email, password, captcha, type } as IRegisterPayload;
    if (this.inviteCodeStore.isEnabled) {
      payload.invite_code = invite_code;
    }

    if (this.props.referralToken) {
      payload.referralToken = this.props.referralToken;
    }

    this.registerStore.registerAttempt(payload).catch(() => {
      if (this.registerStore.hasError) {
        if (this.props.scrollToError) {
          this.props.scrollToError();
        }
      }
    });
  };

  handleClose = () => {
    this.props.history.push('/');
  };

  render() {
    const { email, password, invite_code } = this.state;
    const {
      isCaptchaIncorrect, isEmailIncorrect, isEmailAlreadyRegistered, isPasswordIncorrect,
      isInviteCodeIncorrect, isReferralIncorrect, captchaMustBeReload } = this.registerStore;

    const { intl } = this.props;

    const emailErrorMessage = !isEmailAlreadyRegistered
        ? intl.formatMessage({id: 'authorization.validation.incorrectEmail'})
        : intl.formatMessage({id: 'authorization.validation.alreadyRegisteredEmail'});

    const inviteCodeErrorMessage = 'Incorrect invite code';
    const referralErrorMessage = 'Incorrect referral code';

    return (
      <Modal isOpen disableOverlay className='modal__register' onRequestClose={this.handleClose}>
        <h2 className='modal__title'>{intl.formatMessage({
          id: 'authorization.signUp',
        })}</h2>
        <div className='container p-0'>
          <form onSubmit={this.handleSubmit}>
            <Input name='email'
                   label={intl.formatMessage({
                     id: 'authorization.email',
                   })}
                   placeholder={intl.formatMessage({
                     id: 'authorization.emailPlaceholder',
                   })}
                   autoComplete='new-email'
                   errorMessage={emailErrorMessage}
                   showError={isEmailAlreadyRegistered || isEmailIncorrect}
                   onChange={this.handleChange}
                   value={email}
            />

            <div className='row pl-2 pb-3'>
              <RadioButton
                name={'type'}
                value={AccountType.Natural}
                label={intl.formatMessage({
                  id: 'authorization.personalAccount',
                })}
                onChange={this.handleChange}
                showError={this.state.typeShowError}
                classNames='mb-2 mb-md-2'
                checked={this.isNatural}
              />

              <RadioButton
                name={'type'}
                value={AccountType.LegalEntity}
                label={intl.formatMessage({
                  id: 'authorization.corporateAccount',
                })}
                onChange={this.handleChange}
                showError={this.state.typeShowError}
                classNames='mb-0 mb-md-0'
                checked={!this.isNatural}
              />
            </div>

            <Password name='password' showSwitcher={true}
              label={intl.formatMessage({
                id: 'authorization.password',
              })}
              placeholder={intl.formatMessage({
                id: 'authorization.passwordPlaceholder',
              })}
              errorMessage={intl.formatMessage({
                id: 'authorization.validation.notStrongPassword',
              })}
              autoComplete='new-password'
              showError={isPasswordIncorrect}
              onChange={this.handleChange}
              value={password}
            />

            <PasswordRequirements password={password} />

            <div className='container d-flex justify-content-center flex-column mb-2 pb-3'>
              <div className='row container-responsive__registration'>
                <CheckBox
                  name='PrivacyPolicy'
                  label={intl.formatMessage({
                    id: 'authorization.iAgreeWith',
                  })}
                  onChange={this.handleChange}
                  showError={this.state.PrivacyPolicyError}
                  className={classNames('checkbox-responsive', this.localeStore.locale === 'en' ? 'mb-0' : 'mb-2')}
                />
                <a href='/documents/Privacy Policy.pdf'
                   target='_blank'
                   className='container-responsive__registration-font container-responsive__registration-font-agree'
                >
                  <FormattedMessage id='authorization.privacyPolicy' defaultMessage='Privacy Policy' />
                </a>
              </div>

              <div className='row container-responsive__registration'>
                <CheckBox
                  name='TermsOfUse'
                  label={intl.formatMessage({
                    id: 'authorization.iAgreeWith',
                  })}
                  onChange={this.handleChange}
                  showError={this.state.TermsOfUseError}
                  className={classNames('checkbox-responsive', this.localeStore.locale === 'en' ? 'mb-0' : 'mb-2')}
                />
                <a href='/documents/Terms and Conditions.pdf'
                   target='_blank'
                   className='container-responsive__registration-font container-responsive__registration-font-agree'
                >
                  <FormattedMessage id='authorization.termsOfUse' defaultMessage='Terms of use' />
                </a>
              </div>

              <div className='row container-responsive__registration'>
                <CheckBox
                  name='RefundPolicy'
                  label={intl.formatMessage({
                    id: 'authorization.iAgreeWith',
                  })}
                  onChange={this.handleChange}
                  showError={this.state.RefundPolicyError}
                  className={classNames('checkbox-responsive', this.localeStore.locale === 'en' ? 'mb-0' : 'mb-2')}
                />
                <a href='/refund-policy'
                   target='_blank'
                   className='container-responsive__registration-font container-responsive__registration-font-agree'
                >
                  <FormattedMessage id='authorization.refundPolicy' defaultMessage='Refund policy' />
                </a>
              </div>
            </div>

            {this.inviteCodeStore.isEnabled &&
            <Input name='invite_code'
                   label={intl.formatMessage({
                     id: 'authorization.inviteCode',
                   })}
                   placeholder={intl.formatMessage({
                     id: 'authorization.inviteCodePlaceholder',
                   })}
                   errorMessage={inviteCodeErrorMessage}
                   showError={isInviteCodeIncorrect}
                   onChange={this.handleChange}
                   value={invite_code}
            />
            }

            {this.props.referralToken &&
            <Input
              name='referral'
              label={intl.formatMessage({
                id: 'authorization.referral',
              })}
              placeholder={intl.formatMessage({
                id: 'authorization.referralPlaceholder',
              })}
              showError={isReferralIncorrect}
              errorMessage={referralErrorMessage}
              onChange={this.handleChange}
              value={this.props.referralToken}
            />
            }

            <ReCaptcha
              name='captcha'
              onChange={this.handleChange}
              errorMessage={'Can\'t validate captcha'}
              showError={isCaptchaIncorrect}
              resetByProps={captchaMustBeReload}
            />

            <Button className='dashboard-btn dashboard-btn--modal' type='submit'>
              <FormattedMessage id='authorization.signUp' />
            </Button>

            <p className='modal__login_sign-up no-margin text-center mt-3'>
              <FormattedMessage id='authorization.haveAccount'/>
              <Link to='/login'>
                <FormattedMessage id='authorization.signIn' defaultMessage='Login'/>
              </Link>
            </p>
          </form>
        </div>

      </Modal>
    );
  }
}

export default withScrollToError(injectIntl(withRouter(RegisterContainer))) as ComponentClass<any>;