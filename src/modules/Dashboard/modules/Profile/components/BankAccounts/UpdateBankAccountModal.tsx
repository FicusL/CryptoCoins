import * as React from 'react';
import ModalBase from '../../../../../Modals/components/ModalBase';
import Button from '../../../../../Shared/components/Buttons/Button';
import Input from '../../../../../Shared/components/Inputs/Input';
import { lazyInject } from '../../../../../IoC';
import { IBankAccount } from '../../interfaces/IBankAccount';
import { BankAccountsStore } from '../../stores/BankAccountsStore';
import { observer } from 'mobx-react';
import Select from '../../../../../Shared/components/Inputs/Select';
import { FiatCurrenciesStore } from '../../../../../Shared/modules/Currencies/store/concrete/FiatCurrenciesStore';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { ModalStore } from '../../../../../Modals/store/ModalStore';

interface IProps {
  bankAccount: IBankAccount;
  onClose: () => void;
}

@observer
class UpdateBankAccountModal extends React.Component<IProps & InjectedIntlProps> {
  @lazyInject(BankAccountsStore)
  readonly store: BankAccountsStore;

  @lazyInject(ModalStore)
  private readonly modalStore: ModalStore;

  @lazyInject(FiatCurrenciesStore)
  readonly fiatCurrenciesStore: FiatCurrenciesStore;

  constructor(props: IProps & InjectedIntlProps) {
    super(props);

    this.store.UI.updateFields({
      label: this.props.bankAccount.label,
      bankName: this.props.bankAccount.bankName,
      recipientName: this.props.bankAccount.recipientName,
      currency: this.props.bankAccount.currency,
      IBAN: this.props.bankAccount.IBAN,
      BIC: this.props.bankAccount.BIC,
    });
  }

  componentWillMount() {
    this.store.fetchAvailableCurrencies();
  }

  componentWillUnmount(): void {
    this.store.UI.resetFields();
  }

  handleChange = ({ name, value }) => {
    if (name === 'BIC') {
      value = value.toUpperCase();
    }

    this.store.UI.changeField(name, value);
  };

  changeBank = async () => {
    this.store.UI.validateForm();
    if (!this.store.UI.isFormValid) {
      return;
    }

    const bankAccount: IBankAccount = {
      id: this.props.bankAccount.id,
      label: this.store.UI.fields.label.value as string,
      bankName: this.store.UI.fields.bankName.value as string,
      recipientName: this.store.UI.fields.recipientName.value as string,
      currency: this.store.UI.fields.currency.value as string,
      IBAN: this.store.UI.fields.IBAN.value as string,
      BIC: this.store.UI.fields.BIC.value as string,
    };

    await this.store.updateBankAccount(bankAccount);
    if (!this.store.UI.isFormValid) {
      return;
    }

    this.props.onClose();
  };

  render() {
    const { onClose, bankAccount, intl } = this.props;
    const { label, bankName, recipientName, currency, IBAN, BIC } = this.store.UI.fields;
    const { currencies } = this.fiatCurrenciesStore;

    const currencyOptions = currencies.map(currency => ({ label: currency, value: currency }));

    return (
      <ModalBase onRequestClose={onClose} className='wallet-modal'>
        <ModalBase.Title>
          <FormattedMessage id='dashboard.settings.change.bankAccount.title' defaultMessage='Bank account' />
        </ModalBase.Title>
        <Input
          name='label'
          label={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.label',
            defaultMessage: 'Label',
          })}
          value={label.value}
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
          value={bankName.value}
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
          placeholder='Enter recipient name'
          value={recipientName.value}
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
          value={currency.value}
          options={currencyOptions}
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
          value={IBAN.value}
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
          value={BIC.value}
          showError={!!BIC.error}
          errorMessage={BIC.error}
          onChange={this.handleChange}
        />

        <Button className='dashboard-btn dashboard-btn--modal mb-3' onClick={this.changeBank}>
          <FormattedMessage id='dashboard.settings.change' defaultMessage='Change' />
        </Button>
        <div className='text--center'>
          <span className='modal__secondary-action' onClick={() => {
            onClose();
            this.modalStore.openModal('DELETE_CONFIRM', {bankAccount});
          }}>
            <FormattedMessage id='dashboard.settings.deleteBankAccount' defaultMessage='Delete bank account' />
          </span>
        </div>
      </ModalBase>
    );
  }
}

export default injectIntl(UpdateBankAccountModal);