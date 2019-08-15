import * as React from 'react';
import { lazyInject } from '../../../IoC';
import { CounterpartyAccountStore } from '../../stores/CounterpartyAccountStore';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { observer } from 'mobx-react';

@observer
class StatusContainer extends React.Component<InjectedIntlProps> {

  @lazyInject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  componentWillMount(): void {
    this.counterpartyAccountStore.getTransaction();
  }

  render() {

    const { intl } = this.props;

    return(
      <div className='container text-center mt-3'>
        <h1 className='font-responsive__title mb-3'>{intl.formatMessage({
          id: 'counterparties.statusTransaction.header',
          defaultMessage: 'Transaction status: ',
        })} {this.counterpartyAccountStore.status}</h1>
        <p>
          {intl.formatMessage({
            id: 'counterparties.statusTransaction.body',
            defaultMessage: 'We ensure favorable cryptocurrency prices according to our Best Execution Policy. Generally,\n' +
                '          it takes less than 1 hour for the transaction to complete. You can track the status\n' +
                '          of your order on this page.',
          })}
        </p>
      </div>
    );
  }
}

export default injectIntl(StatusContainer);
