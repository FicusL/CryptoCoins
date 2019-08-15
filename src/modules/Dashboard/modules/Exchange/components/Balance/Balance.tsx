import './style.scss';
import * as React from 'react';
import { observer } from 'mobx-react';
import FiatTable from './FiatTable';
import CryptoTable from './CryptoTable';
import BigNumber from 'bignumber.js';
import { FormattedMessage } from 'react-intl';
import { lazyInject } from '../../../../../IoC';
import { LocaleStore } from '../../../../../Shared/stores/LocaleStore';

interface IProps {
  fiatBalances: Map<string, BigNumber>;
  cryptoBalances: Map<string, BigNumber>;
}

@observer
class Balance extends React.Component<IProps> {
  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  constructor(props) {
    super(props);
  }

  render() {
    const { locale } = this.localeStore;

    return (
      <section className='wallet'>
        <h2 className='wallet__container-title text-center text-md-left'>
          <FormattedMessage id='dashboard.exchange.balance' defaultMessage='Balance' />
        </h2>

        <FiatTable balances={this.props.fiatBalances}/>
        <CryptoTable balances={this.props.cryptoBalances}/>
      </section>
    );
  }
}

export default Balance;