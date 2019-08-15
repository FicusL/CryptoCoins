import * as React from 'react';
import ModalBase from '../../../../../Modals/components/ModalBase';
import Button from '../../../../../Shared/components/Buttons/Button';
import Input from '../../../../../Shared/components/Inputs/Input';
import { lazyInject } from '../../../../../IoC';
import { BankAccountsStore } from '../../stores/BankAccountsStore';
import { IBankAccount } from '../../interfaces/IBankAccount';
import { observer } from 'mobx-react';
import Select from '../../../../../Shared/components/Inputs/Select';
import { FiatCurrenciesStore } from '../../../../../Shared/modules/Currencies/store/concrete/FiatCurrenciesStore';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';

interface IProps {
  onClose: () => void;
}

@observer
class AddBankAccountModal extends React.Component<IProps & InjectedIntlProps> {
  @lazyInject(BankAccountsStore)
  readonly store: BankAccountsStore;

  @lazyInject(FiatCurrenciesStore)
  readonly fiatCurrenciesStore: FiatCurrenciesStore;

  constructor(props) {
    super(props);

    this.store.UI.updateFields({
      label: '',
      bankName: '',
      recipientName: '',
      currency: '',
      IBAN: '',
      BIC: '',
    });

  }

  componentWillMount() {
    this.fiatCurrenciesStore.requestCurrencies();
  }

  componentWillUnmount(): void {
    this.store.UI.resetFields();
  }

  handleChange = ({ name, value }) => {
    if (name === 'BIC') {
      value = value.toUpperCase(); // tslint:disable-line
    }

    this.store.UI.changeField(name, value);
  };

  addBank = async () => {
    this.store.UI.validateForm();
    if (!this.store.UI.isFormValid) {
      return;
    }

    const bankAccount: IBankAccount = {
      label: this.store.UI.fields.label.value as string,
      bankName: this.store.UI.fields.bankName.value as string,
      recipientName: this.store.UI.fields.recipientName.value as string,
      currency: this.store.UI.fields.currency.value as string,
      IBAN: this.store.UI.fields.IBAN.value as string,
      BIC: this.store.UI.fields.BIC.value as string,
    };

    await this.store.addBankAccount(bankAccount);
    if (!this.store.UI.isFormValid) {
      return;
    }

    this.props.onClose();
  };

  render() {
    const { onClose, intl } = this.props;
    const { label, bankName, recipientName, currency, IBAN, BIC } = this.store.UI.fields;
    const { currencies } = this.fiatCurrenciesStore;
    return (
      <ModalBase onRequestClose={onClose} className='wallet-modal'>
        <ModalBase.Title>
          <FormattedMessage id='dashboard.settings.addBankAccount.title' defaultMessage='Add bank account' />
        </ModalBase.Title>
        <Input
          name='label'
          label={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.label',
            defaultMessage: 'Label',
          })}
          placeholder={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.labelPlaceholder',
            defaultMessage: 'Enter label (optional)',
          })}
          showError={!!label.error}
          errorMessage={label.error}
          onChange={this.handleChange}
        />
        <Input
          name='bankName'
          label={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.bankName',
            defaultMessage: 'Bank name',
          })}
          placeholder={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.bankNamePlaceholder',
            defaultMessage: 'Enter bank name',
          })}
          showError={!!bankName.error}
          errorMessage={bankName.error}
          onChange={this.handleChange}
        />

        <Input
          name='recipientName'
          label={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.recipientName',
            defaultMessage: 'Recipient name',
          })}
          placeholder={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.recipientNamePlaceholder',
            defaultMessage: 'Enter recipient name',
          })}
          showError={!!recipientName.error}
          errorMessage={recipientName.error}
          onChange={this.handleChange}
        />

        <Select
          name='currency'
          label={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.currency',
            defaultMessage: 'Currency',
          })}
          placeholder={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.currencyPlaceholder',
            defaultMessage: 'Enter currency',
          })}
          options={currencies.map(currency => ({ label: currency, value: currency }))}
          showError={!!currency.error}
          errorMessage={currency.error}
          onChange={this.handleChange}
          forceDropdown
        />
        <Input
          name='IBAN'
          label={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.IBANOrAccountNumber',
            defaultMessage: 'IBAN/Account Number',
          })}
          placeholder={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.IBANOrAccountNumberPlaceholder',
            defaultMessage: 'Enter IBAN/Account number',
          })}
          mask='**** **** **** **** **** **** **** ****'
          maskChar={null}
          showError={!!IBAN.error}
          errorMessage={IBAN.error}
          onChange={this.handleChange}
        />
        <Input
          name='BIC'
          label={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.SWIFTOrBIC',
            defaultMessage: 'SWIFT/BIC',
          })}
          placeholder={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.SWIFTOrBICPlaceholder',
            defaultMessage: 'Enter SWIFT/BIC',
          })}
          showError={!!BIC.error}
          errorMessage={BIC.error}
          onChange={this.handleChange}
          value={this.store.UI.fields.BIC.value}
        />

        <Button className='dashboard-btn dashboard-btn--modal' onClick={this.addBank}>
          <FormattedMessage id='dashboard.settings.add' defaultMessage='Add' />
        </Button>
      </ModalBase>
    );
  }
}

export default injectIntl(AddBankAccountModal);