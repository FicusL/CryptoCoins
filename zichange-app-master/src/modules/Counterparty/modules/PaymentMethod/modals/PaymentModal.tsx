import * as React from 'react';
import { lazyInject } from '../../../../IoC';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import './style.scss';
import MasterCardImage from '../assets/mc_symbol.svg';
import VisaImage from '../assets/visa_pos_fc_rgb.svg';
import { FormattedMessage } from '../../../../../react-intl-helper';
import Input from '../../../../Shared/components/Inputs/Input';
import CheckBox from '../../../../Shared/components/Inputs/Checkbox/Checkbox';
import { ColorStore } from '../../../../Admin/modules/Counterparty/stores/Colors/ColorStore';
import Button from '../../../../Shared/components/Buttons/Button';
import { PaymentStore } from '../stores/PaymentStore';
import { CounterpartyAccountStore } from '../../../stores/CounterpartyAccountStore';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Modal from '../../../../Modals/components/ModalBase';
import { TransactionsStore } from '../../../../Dashboard/modules/Transactions/stores/TransactionsStore';
import { RoyalPayPaymentStore } from '../../../../Dashboard/modules/PaymentMethods/stores/RoyalPayPaymentStore';

interface IProps {
  onClose?: () => void;
  referenceId?: string;
}

@observer
class PaymentModal extends React.Component<IProps & InjectedIntlProps> {

  @lazyInject(RoyalPayPaymentStore)
  store: RoyalPayPaymentStore;

  @lazyInject(PaymentStore)
  paymentStore: PaymentStore;

  @lazyInject(TransactionsStore)
  transactionsStore: TransactionsStore;

  @lazyInject(CounterpartyAccountStore)
  accountStore: CounterpartyAccountStore;

  @lazyInject(ColorStore)
  colorStore: ColorStore;

  @observable cardNumber: string = '';
  @observable expiration: string = '';
  @observable cvc: string = '';
  @observable nameOwner: string = '';

  @observable get: string = '';
  @observable fee: string = '';
  @observable pay: string = '';

  componentWillMount(): void {
    this.transactionsStore.getTransactionByReferenceId(this.props.referenceId).then((transaction) => {

      this.pay = transaction.deposit.amount.toString();
      this.fee = transaction.deposit.fee.amount.toString();
      this.get = (transaction.deposit.amount.toNumber() - transaction.deposit.fee.amount.toNumber()).toString();

    });
  }

  componentWillUnmount(): void {
    this.store.reset();
  }

  submitHandler = (e) => {
    e.preventDefault();

    const [ expirationMonth, expirationYear ] = this.expiration.split('/');

    const expirationYearFormatted = `20${expirationYear}`;

    const payload = {
      cardNumber: this.cardNumber.replace(/ /g, ''),
      cvc: this.cvc,
      name: this.nameOwner,
      expirationMonth,
      expirationYear: expirationYearFormatted,
      confirm1: this.paymentStore.values.confirm1,
      confirm2: this.paymentStore.values.confirm2,
    };

    this.accountStore.referenceId = this.props.referenceId;

    this.store.payRequest(payload).then(() => {
      if (this.store.method.toUpperCase() === 'GET') {
        const form = document.createElement('form');
        form.action = this.store.url;
        form.method = this.store.method;
        form.target = '_self';
        form.style.display = 'none';
        document.body.appendChild(form);
        form.submit();
      } else {
        const form = document.createElement('form');
        form.action = this.store.url;
        form.method = this.store.method;
        form.target = '_self';
        form.style.display = 'none';
        this.store.params.forEach((item) => {
          const input = document.createElement('input');
          input.name = item[0];
          input.value = item[1];
          input.type = 'hidden';
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      }
    });
  };

  cardNumberHandler = (e) => {
    this.cardNumber = e.value;
  };

  expirationHandler = (e) => {
    this.expiration = e.value;
  };

  cvcHandler = (e) => {
    this.cvc = e.value;
  };

  nameOwnerHandler = (e) => {
    this.nameOwner = e.value;
  };

  handleChange = ({name, value}) => {
    this.paymentStore.change(name, value);
  };

  render() {

    const { intl } = this.props;

    return(
      <Modal onRequestClose={this.props.onClose} className='modal mt-5'>
        <Modal.Title>
          Payment details
        </Modal.Title>

        <form onSubmit={this.submitHandler}>
          <div className='d-flex justify-content-center row mb-2'>
            <p className='col-12 text-center mb-2'>
              All transactions are secured and encrypted
            </p>
            <div className='footer__cards row col-12 justify-content-center mb-3 mb-md-0'>
              <img src={MasterCardImage} alt='Master Card Icon' className='pr-3'/>
              <img src={VisaImage} alt='Visa Icon' />
            </div>
          </div>

          <Input
              name='CARD_NUMBER'
              label='Card number'
              placeholder='XXXX XXXX XXXX XXXX'
              value={this.cardNumber}
              onChange={this.cardNumberHandler}
              mask='**** **** **** ****'
              maskChar={null}
              colors={this.accountStore.isAgent && this.colorStore.styles.input}
              showError={!!this.store.cardNumberError}
              errorMessage={intl.formatMessage({
                id: 'counterparties.paymentMethod.cardNumber',
                defaultMessage: 'Your card number is not correct',
              })}
          />
          <div className='row'>
            <Input
                name='EXPIRATION'
                label='Expiration'
                placeholder='MM/YY'
                mask='**/**'
                maskChar={null}
                value={this.expiration}
                onChange={this.expirationHandler}
                className='col-md-6'
                colors={this.accountStore.isAgent && this.colorStore.styles.input}
                showError={!!this.store.expirationYearError || !!this.store.expirationMonthError}
                errorMessage={intl.formatMessage({
                  id: 'counterparties.paymentMethod.expired',
                  defaultMessage: 'Your card is expired',
                })}
            />
            <Input
              name='CVC'
              label='CVC'
              type='password'
              placeholder='___'
              mask='***'
              maskChar={null}
              value={this.cvc}
              onChange={this.cvcHandler}
              className='col-md-6'
              colors={this.accountStore.isAgent && this.colorStore.styles.input}
              showError={!!this.store.cvcError}
              errorMessage={intl.formatMessage({
                id: 'counterparties.paymentMethod.cvc',
                defaultMessage: 'Incorrect CVC code',
              })}
            />
          </div>
          <Input
            name='NAME'
            label='Name'
            placeholder='Enter name on your card'
            value={this.nameOwner}
            onChange={this.nameOwnerHandler}
            colors={this.accountStore.isAgent && this.colorStore.styles.input}
            showError={!!this.store.nameError}
            errorMessage={intl.formatMessage({
              id: 'counterparties.paymentMethod.name',
              defaultMessage: 'Please enter your name',
            })}
          />

          <hr style={{marginLeft: '-15px', marginRight: '-15px'}} />

          <div className='d-flex justify-content-between mb-2'>
            <p>Pay</p>
            <p>{this.pay} EUR</p>
          </div>
          <div className='d-flex justify-content-between mb-2'>
            <p>Fee</p>
            <p>{this.fee} EUR</p>
          </div>
          <div className='d-flex justify-content-between'>
            <p>Get</p>
            <p>{this.get} EUR</p>
          </div>

          <hr style={{marginLeft: '-15px', marginRight: '-15px'}} />

          <div className='container d-flex justify-content-center flex-column mb-2'>
            <div className='row container-responsive__registration mt-2'>
              <CheckBox
                name='confirm1'
                label='I agree with ZiChanges'
                onChange={this.handleChange}
                checked={this.paymentStore.values.confirm1}
                className='p-0 col-md-5'
                showError={!!this.store.confirm1Error}
                colors={this.accountStore.isAgent && this.colorStore.styles.checkBox}
              />
              <p className='p-0 m-0 col-md-7'>
                <a href='/documents/Terms and Conditions.pdf'
                   target='_blank'
                >
                  <FormattedMessage id='authorization.termsOfUse' defaultMessage='Terms of use' />
                </a>,&nbsp;
                <a href='/documents/Privacy Policy.pdf'
                   target='_blank'
                >
                  <FormattedMessage id='authorization.privacyPolicy' defaultMessage='Privacy Policy' />
                </a>,&nbsp;
                <a href='/refund-policy'
                   target='_blank'
                >
                  <FormattedMessage id='authorization.refundPolicy' defaultMessage='Refund policy' />
                </a>
              </p>

            </div>

            <div className='row container-responsive__registration mt-2'>
              <CheckBox
                name='confirm2'
                label='I agree to comply with all applicable regulations related to digital assets
                in my country of residence.'
                onChange={this.handleChange}
                checked={this.paymentStore.values.confirm2}
                showError={!!this.store.confirm2Error}
                className='p-0'
                colors={this.accountStore.isAgent && this.colorStore.styles.checkBox}
              />
            </div>
          </div>
          <Button type='submit'
                  className='dashboard-btn dashboard-btn--modal dashboard-btn dashboard-btn--undefined m-0'
                  colors={this.accountStore.isAgent && this.colorStore.styles.button}
          >
            PAY NOW
          </Button>
        </form>
      </Modal>
    );
  }
}

export default injectIntl(PaymentModal);