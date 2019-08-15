import * as React from 'react';
import Layout from './Layout';
import { FormattedMessage, injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import { lazyInject } from '../IoC';
import { LocaleStore } from '../Shared/stores/LocaleStore';

@observer
class Fees extends React.Component {
  @lazyInject(LocaleStore)
  localeStore: LocaleStore;

  render() {
    const { locale } = this.localeStore;

    return (
      <Layout>
        <h1 className='policy-page__title'><FormattedMessage id='fees.firstTitle'/></h1>

        <h3 className='policy-page__subtitle'><FormattedMessage id='fees.firstSubtitle'/></h3>
        <h4 className='text--bold'><FormattedMessage id='fees.bitcoin'/></h4>
        <ul className='policy-page__unordered-list'>
          <li><FormattedMessage id='fees.bitcoinDeposits'/></li>
          <li><FormattedMessage id='fees.bitcoinWithdrawals'/></li>
        </ul>

        <h3 className='policy-page__subtitle'><FormattedMessage id='fees.secondSubtitle'/><sup>1</sup></h3>
        <h4 className='text--bold'><FormattedMessage id='fees.sepaEur'/></h4>
        <ul className='policy-page__unordered-list'>
          <li><FormattedMessage id='fees.sepaEurDeposits'/></li>
          <li><FormattedMessage id='fees.sepaEurWithdrawals'/></li>
        </ul>

        <h3 className='policy-page__subtitle'><FormattedMessage id='fees.thirdSubtitle'/></h3>
        {/*<h4 className='text--bold'>Payeer USD, EUR</h4>*/}
        {/*<ul className='policy-page__unordered-list'>*/}
          {/*<li>Deposits from 20 up to 5000. Fee 3% + 9.95</li>*/}
          {/*<li>Withdrawals from 100 up to 10 000 USD or EUR. Fee 1 EUR</li>*/}
          {/*<li>VISA, Mastercard, Maestro cards allowed for deposits</li>*/}
        {/*</ul>*/}
        <h4 className='text--bold'><FormattedMessage id='fees.advcashTitle'/></h4>
        <ul className='policy-page__unordered-list'>
          <li><FormattedMessage id='fees.advcashTitleDeposits'/></li>
          <li><FormattedMessage id='fees.advcashWithdrawals'/></li>
          <li><FormattedMessage id='fees.advcashVisa'/></li>
        </ul>

        <h3 className='policy-page__subtitle'><FormattedMessage id='fees.fourdSubtitle'/></h3>
        <ul className='policy-page__unordered-list'>
          <li><FormattedMessage id='fees.taker'/></li>
        </ul>

        <sub><FormattedMessage id='fees.processing'/></sub>

      </Layout>
    );
  }
}

export default Fees;