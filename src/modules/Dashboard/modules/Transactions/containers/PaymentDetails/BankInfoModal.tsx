import * as React from 'react';
import ModalBase from '../../../../../Modals/components/ModalBase';
import Button from '../../../../../Shared/components/Buttons/Button';
import Input from '../../../../../Shared/components/Inputs/Input';
import { observer } from 'mobx-react';
import { TransactionModel } from '../../../../../Shared/modules/Transactions/model/TransactionModel';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

interface IProps {
  currentTransaction: TransactionModel;
  onClose: () => void;
}

@observer
class BankInfoModal extends React.Component<IProps & InjectedIntlProps> {

  constructor(props: IProps & InjectedIntlProps) {
    super(props);
  }

  handleChange = ({name, value}) => {
    return ;
  };

  render() {
    const { onClose, intl } = this.props;

    // TODO: Remove any
    const { beneficiaryBank, beneficiaryBankCurrency, beneficiaryBankAccount, beneficiaryBankSwift } =
      this.props.currentTransaction as any;

    return (
      <ModalBase onRequestClose={onClose}>
        <ModalBase.Title>Bank account</ModalBase.Title>
        <Input
          name='bankName'
          label={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.bankName',
            defaultMessage: 'Bank name',
          })}
          value={beneficiaryBank}
          onChange={this.handleChange}
          disabled={true}
        />
        <Input
          name='currency'
          label={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.currency',
            defaultMessage: 'Currency',
          })}
          value={beneficiaryBankCurrency}
          onChange={this.handleChange}
          disabled={true}
        />
        <Input
          name='IBAN'
          label={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.IBANOrAccountNumber',
            defaultMessage: 'IBAN/Account Number',
          })}
          value={beneficiaryBankAccount}
          onChange={this.handleChange}
          disabled={true}
        />
        <Input
          name='BIC'
          label={intl.formatMessage({
            id: 'dashboard.settings.addBankAccount.SWIFTOrBIC',
            defaultMessage: 'SWIFT/BIC',
          })}
          value={beneficiaryBankSwift}
          onChange={this.handleChange}
          disabled={true}
        />

        <Button className='dashboard-btn dashboard-btn--modal' onClick={onClose}>
          <FormattedMessage id='dashboard.ok' defaultMessage='OK' />
        </Button>
      </ModalBase>
    );
  }
}

export default injectIntl(BankInfoModal);