import * as React from 'react';
import Button from '../../../../../Shared/components/Buttons/Button';
import { lazyInject } from '../../../../../IoC';
import { ModalStore } from '../../../../../Modals/store/ModalStore';
import BigNumber from 'bignumber.js';
import { AccountStore } from '../../../Profile/stores/AccountStore';
import { observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';

interface IProps {
  balances: Map<string, BigNumber>;
}

@observer
class FiatTable extends React.Component<IProps & RouteComponentProps> {
  @lazyInject(ModalStore)
  private readonly modalStore: ModalStore;

  @lazyInject(AccountStore)
  private readonly accountStore: AccountStore;

  onDeposit = (currency: string) => {
    if (!this.accountStore.validateKYCStatus()) {
      return;
    }

    if (!this.accountStore.twoFaEnabled) {
      this.modalStore.openModal('PLEASE_ENABLE_2FA');
      return;
    }

    this.modalStore.openModal(
      'DEPOSIT_FIAT',
      { currency },
    );
  };

  onWithdrawal = (currency: string) => {
    if (!this.accountStore.validateKYCStatus()) {
      return;
    }

    this.modalStore.openModal(
      'WITHDRAW_FIAT',
      { currency },
    );
  };

  render() {
    const balances = this.props.balances;
    const currencies = Array.from(balances.keys());

    return (
      <div className='wallet__table'>
        <h2 className='wallet__title text-lg-left'>
          <FormattedMessage id='dashboard.exchange.fiat' defaultMessage='Fiat' />
        </h2>

        {currencies.map((currency, i) => (
          <div className='wallet__table-row' key={i}>
            <div className='row align-items-center'>
              <div className='col-6 col-lg-3'>{currency}</div>
              <div className='col-6 col-lg-3 text-right text-lg-center'>
                {(balances.get(currency) || new BigNumber(0)).toFixed(2)}
              </div>
              <div className='col-lg'>
                <div className='wallet__table__buttons'>
                  <Button name='white' onClick={() => this.onDeposit(currency)}>
                    <FormattedMessage id='dashboard.exchange.deposit' defaultMessage='Deposit' />
                  </Button>

                  <Button name='sell' onClick={() => this.onWithdrawal(currency)}>
                    <FormattedMessage id='dashboard.exchange.withdraw' defaultMessage='Withdraw' />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(FiatTable) as React.ComponentClass<IProps>;