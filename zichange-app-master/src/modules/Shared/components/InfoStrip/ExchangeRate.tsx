import * as React from 'react';
import { lazyInject } from '../../../IoC';
import { ExchangeStore } from '../../../Dashboard/modules/Exchange/store/ExchangeStore';
import { observer } from 'mobx-react';
import cn from 'classnames';
import numeral from 'numeral';
import { FormattedMessage } from 'react-intl';
import { LocaleStore } from '../../stores/LocaleStore';

@observer
class ExchangeRate extends React.Component {
  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  @lazyInject(ExchangeStore)
  readonly exchangeStore: ExchangeStore;

  render() {
    const { locale } = this.localeStore;

    const bid = this.exchangeStore.bidRates[this.exchangeStore.currentBackendPair];
    const ask = this.exchangeStore.askRates[this.exchangeStore.currentBackendPair];
    const change = this.exchangeStore.changeRates[this.exchangeStore.currentBackendPair];

    return (
      <div className='row info-strip__exchange-rate mt-3 mt-md-0'>
        <div className='exchange-item col mb-1'>
          <p className='header_description'>
            <FormattedMessage id='dashboard.infoStrip.pair' defaultMessage='Pair' />
          </p>
          <span>{this.exchangeStore.currentFrontPair}</span>
        </div>
        <div className='exchange-item col mb-1'>
          <p className='header_description'>
            <FormattedMessage id='dashboard.infoStrip.bid' defaultMessage='Bid' />
          </p>
          <span>{numeral(bid).format('0,0.00')}</span>
        </div>
        <div className='exchange-item col'>
          <p className='header_description'>
            <FormattedMessage id='dashboard.infoStrip.ask' defaultMessage='Ask' />
          </p>
          <span>{numeral(ask).format('0,0.00')}</span>
        </div>
        <div className='exchange-item col'>
          <p className='header_description'>
            <FormattedMessage id='dashboard.infoStrip.change' defaultMessage='Change' />
          </p>
          <span className={cn('change',
            { 'positive': change > 0 },
            { 'negative': change < 0 },
          )}
          >{numeral(change).format('0.00')}%</span>
        </div>
      </div>
    );
  }
}

export default ExchangeRate;