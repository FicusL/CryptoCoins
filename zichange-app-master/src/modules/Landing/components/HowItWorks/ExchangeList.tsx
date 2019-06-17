import * as React from 'react';
import ExchangeIcon from './ExchangeIcon/ExchangeIcon';
import BinanceSVG from './assets/binance.svg';
import BitfinexSVG from './assets/bitfinex.svg';
import KrakenSVG from './assets/kraken.svg';
import OkexSVG from './assets/okex.svg';
import HuobiSVG from './assets/huobi.svg';

class ExchangeList extends React.Component {
  exchanges = [
    { label: 'Binance', icon: BinanceSVG },
    { label: 'Bitfinex', icon: BitfinexSVG },
    { label: 'Kraken', icon: KrakenSVG },
    { label: 'OKEx', icon: OkexSVG },
    { label: 'Huobi', icon: HuobiSVG },
  ];

  render() {
    return (
      <ul className='exchange-list'>
        {this.exchanges.map((exchange, i) => (
          <li key={i}>
            <span className='line-left' />
            <ExchangeIcon icon={exchange.icon} label={exchange.label} />
            <span className='line-right'/>
          </li>
        ))}
      </ul>
    );
  }
}

export default ExchangeList;
