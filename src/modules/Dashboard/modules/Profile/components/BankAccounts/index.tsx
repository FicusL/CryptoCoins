import * as React from 'react';
import { IBankAccount } from '../../interfaces/IBankAccount';
import { observer } from 'mobx-react';
import Button from '../../../../../Shared/components/Buttons/Button';
import { ICryptoWallet } from '../../interfaces/ICryptoWallet';
import { FormattedMessage } from 'react-intl';

interface IProps {
  bankAccounts: Map<number, IBankAccount>;
  onBankClick: (bank: IBankAccount) => void;
  onAddBankClick: () => void;
  onCrossClick: (bank: IBankAccount) => void;
}

@observer
class BankAccounts extends React.Component<IProps> {

  onCrossClickHandler = (e, bankAccount) => {
    e.stopPropagation();
    this.props.onCrossClick(bankAccount);
  };

  render() {
    const { bankAccounts, onAddBankClick, onBankClick } = this.props;
    const bankAccountsArray = Array.from(bankAccounts.values());

    return (
      <div>
        {bankAccountsArray.length !== 0 ?
          <div>
            {bankAccountsArray.map((bankAccount, i) => (
              <div key={i} className='account__details-value clickable' onClick={() => onBankClick(bankAccount)}>
                <h4>
                  <span className='pr-3'>€</span>
                  {bankAccount.bankName}, {bankAccount.IBAN}, {bankAccount.recipientName}
                  <span className='cross' onClick={(target) => this.onCrossClickHandler(target, bankAccount)}></span>
                </h4>
              </div>
            ))}
          </div>
          :
          <div className='account__details-value'>
            <FormattedMessage id='dashboard.settings.haveNoBankAccounts'
                              defaultMessage='You have no connected bank accounts'
            />
          </div>
        }
        <div className='text-right mt-4'>
          <Button name='white' onClick={onAddBankClick}>
            <FormattedMessage id='dashboard.settings.addNewBank'
                              defaultMessage='Add new bank'
            />
          </Button>
        </div>
      </div>
    );
  }
}

export default BankAccounts;