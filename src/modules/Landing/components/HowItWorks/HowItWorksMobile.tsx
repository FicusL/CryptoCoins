import * as React from 'react';
import './style-mobile.scss';
import ClientBuySVG from './assets/client_buy.svg';
import ClientSellSVG from './assets/client_sell.svg';
import BitcoinSVG from './assets/bitcoin.svg';
import BankSVG from './assets/bank.svg';
import AlgorithmSVG from './assets/algorithm.svg';
import CircleImage from './CircleImage/CircleImage';
import LandingButton from '../LandingButton/LandingButton';
import ArrowMobile from './ArrowMobile/ArrowMobile';
import ReactSVG from 'react-svg';
import OrderButton from './OrderButton/OrderButton';
import { Link } from 'react-router-dom';
import ExchangeList from './ExchangeList';
import { FormattedMessage } from 'react-intl';
import { lazyInject } from '../../../IoC';
import { LocaleStore } from '../../../Shared/stores/LocaleStore';
import classNames from 'classnames';

interface IState {
  buyScheme: boolean;
}

class HowItWorksMobile extends React.Component<{}, IState> {
  state: IState = { buyScheme: true };

  showBuyScheme = () => this.setState({ buyScheme: true });
  showSellScheme = () => this.setState({ buyScheme: false });

  @lazyInject(LocaleStore)
  private readonly localeStore: LocaleStore;

  render() {
    const { buyScheme } = this.state;

    return (
      <section className='how-it-works how-it-works--mobile d-xl-none'>
        <div className='scheme-switch mb-4'>
          <h2 className='landing__title mb-3'>
            <FormattedMessage id='landing.HowItWorks.title' />
          </h2>
          <div className='container row justify-content-between'>
            <LandingButton name={buyScheme ? 'active' : 'default'}
                           className='col mr-3'
                           onClick={this.showBuyScheme}
                           style={{padding: '0 20px'}}>
              <FormattedMessage id='landing.HowItWorks.buy' />
            </LandingButton>
            <LandingButton name={!buyScheme ? 'active' : 'default'}
                           className='col' style={{padding: '0 20px'}}
                           onClick={this.showSellScheme}>
              <FormattedMessage id='landing.HowItWorks.sell' />
            </LandingButton>
          </div>
        </div>

        <CircleImage img={buyScheme ? ClientBuySVG : ClientSellSVG}>
          <FormattedMessage id='landing.HowItWorks.client' />
        </CircleImage>
        <ArrowMobile />

        <ReactSVG src={buyScheme ? BankSVG : BitcoinSVG} />
        <h4 className='scheme-title'>
          {buyScheme
            ? <FormattedMessage id='landing.HowItWorks.fiatDeposit' />
            : <FormattedMessage id='landing.HowItWorks.cryptoDeposit' />
          }
        </h4>
        {/*{buyScheme ?*/}
          {/*<ul className='fiat-list text--center'>*/}
            {/*<li><FormattedMessage id='landing.HowItWorks.bankTransfer' />,</li>*/}
            {/*<li><FormattedMessage id='landing.HowItWorks.visaOrMastercard' />,</li>*/}
            {/*<li><FormattedMessage id='landing.HowItWorks.otherPaymentMethods' /></li>*/}
          {/*</ul>*/}
          {/*:*/}
          {/*<p><FormattedMessage id='landing.HowItWorks.secureColdStorage' /></p>*/}
        {/*}*/}

        <ArrowMobile />

        <Link to='/dashboard'>
          <OrderButton >
            {buyScheme
              ? <FormattedMessage id='landing.HowItWorks.buy.capitalize' />
              : <FormattedMessage id='landing.HowItWorks.sell.capitalize' />
            }
          </OrderButton>
        </Link>
        <h4 className='scheme-title'><FormattedMessage id='landing.HowItWorks.placeOrder' /></h4>
        {/*<div className='d-xl-block'>*/}
          {/*<p>*/}
            {/*<FormattedMessage id='landing.HowItWorks.tradeMoreCryptocurrencies.firstPart' />*/}
            {/*&nbsp;*/}
            {/*<FormattedMessage id='landing.HowItWorks.tradeMoreCryptocurrencies.secondPart' />*/}
          {/*</p>*/}
        {/*</div>*/}


        <ArrowMobile/>

        <div className='exchanges-container'>
          <div className='arrow-path--horizontal' />
          <div className='arrow-path--vertical' />
          <ExchangeList/>
        </div>

        <div className='algorithm'>
          <ReactSVG src={AlgorithmSVG} />
          <h4 className='scheme-title'>
            <FormattedMessage id='landing.HowItWorks.smartOrderRouting' />
            <br/>
            <FormattedMessage id='landing.HowItWorks.bestExecution' />
          </h4>
        </div>

        <ArrowMobile/>

        <CircleImage img={buyScheme ? BitcoinSVG : BankSVG}>
          {buyScheme
            ? <FormattedMessage id='landing.HowItWorks.getCrypto' />
            : <FormattedMessage id='landing.HowItWorks.getFiatMoney' />
          }
        </CircleImage>
        <div className='how-it-works_text-format'>
          {buyScheme ?
            <p>
              <FormattedMessage id='landing.HowItWorks.receiveCryptocurrency.firstPart' />
              <br/>
              <FormattedMessage id='landing.HowItWorks.receiveCryptocurrency.secondPart' />
            </p>
            :
            <p>
              <FormattedMessage id='landing.HowItWorks.receiveMoney.firstPart' />
              <br/>
              <FormattedMessage id='landing.HowItWorks.receiveMoney.secondPart' />
            </p>
          }
        </div>
      </section>
    );
  }
}

export default HowItWorksMobile;