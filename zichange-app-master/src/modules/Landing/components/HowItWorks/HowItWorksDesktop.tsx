import * as React from 'react';
import './style.scss';
import ClientBuySVG from './assets/client_buy.svg';
import ClientSellSVG from './assets/client_sell.svg';
import BitcoinSVG from './assets/bitcoin.svg';
import AlgorithmSVG from './assets/algorithm.svg';
import CircleImage from './CircleImage/CircleImage';
import LandingButton from '../LandingButton/LandingButton';
import ReactSVG from 'react-svg';
import BankSVG from './assets/bank.svg';
import OrderButton from './OrderButton/OrderButton';
import ExchangeList from './ExchangeList';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

interface IState {
  buyScheme: boolean;
}

class HowItWorksDesktop extends React.Component<{}, IState> {
  state: IState = { buyScheme: true };

  showBuyScheme = () => this.setState({ buyScheme: true });
  showSellScheme = () => this.setState({ buyScheme: false });

  render() {
    const { buyScheme } = this.state;

    return (
      <section className='how-it-works d-none d-xl-block'>
        <div className='container'>

          <div className='d-flex justify-content-between align-top'>
            <div className='border-top__container'>
              <div className='border-top border-top--left' />
              <div className='arrow arrow--down' />
            </div>

            <div className='top-section'>
              <CircleImage img={buyScheme ? ClientBuySVG : ClientSellSVG} >
                <FormattedMessage id='landing.HowItWorks.client' />
              </CircleImage>

              <div className='scheme-switch'>
                <h2 className='landing__title mb-3'>
                  <FormattedMessage id='landing.HowItWorks.title' />
                </h2>
                <div className='d-flex justify-content-between'>
                  <LandingButton name={buyScheme ? 'active' : 'default'} className='mr-5' onClick={this.showBuyScheme}>
                    <FormattedMessage id='landing.HowItWorks.buy' />
                  </LandingButton>
                  <LandingButton name={!buyScheme ? 'active' : 'default'} onClick={this.showSellScheme}>
                    <FormattedMessage id='landing.HowItWorks.sell' />
                  </LandingButton>
                </div>
              </div>

              <div>
                <CircleImage img={buyScheme ? BitcoinSVG : BankSVG}>
                  {buyScheme
                    ? <FormattedMessage id='landing.HowItWorks.getCrypto' />
                    : <FormattedMessage id='landing.HowItWorks.getFiatMoney' />
                  }
                </CircleImage>
                {buyScheme ?
                <p className='right-caption'>
                  <FormattedMessage id='landing.HowItWorks.receiveCryptocurrency.firstPart' />
                  <br/>
                  <FormattedMessage id='landing.HowItWorks.receiveCryptocurrency.secondPart' />
                </p>
                :
                <p className='right-caption'>
                  <FormattedMessage id='landing.HowItWorks.receiveMoney.firstPart' />
                  <br/>
                  <FormattedMessage id='landing.HowItWorks.receiveMoney.secondPart' />
                </p>
                }
              </div>
            </div>

            <div className='border-top__container'>
              <div className='border-top border-top--right' />
              <div className='arrow arrow--up' />
            </div>
          </div>


          <div className='d-flex'>
            <div>
              <div className='deposit-order-container'>
                <div className='border-bottom__container'>
                  <div className='border-bottom border-bottom--left' />
                </div>
                <ReactSVG src={buyScheme ? BankSVG : BitcoinSVG} className='deposit__icon'/>
                <div className='arrow-path--horizontal' />
                <div className='arrow arrow--right' />
                <div className='arrow-path--horizontal' />
                <Link to='/dashboard'>
                  <OrderButton >
                    {buyScheme
                      ? <FormattedMessage id='landing.HowItWorks.buy.capitalize' />
                      : <FormattedMessage id='landing.HowItWorks.sell.capitalize' />
                    }
                  </OrderButton>
                </Link>
                <div className='arrow-path--horizontal' />
                <div className='arrow arrow--right' />
              </div>
              <div className='deposit-order-text'>
                <div className='deposit-text'>
                  <h4 className='scheme-title'>
                    {buyScheme
                      ? <FormattedMessage id='landing.HowItWorks.fiatDeposit' />
                      : <FormattedMessage id='landing.HowItWorks.cryptoDeposit' />
                    }
                  </h4>
                  {buyScheme ?
                  <ul className='fiat-list'>
                    <li><FormattedMessage id='landing.HowItWorks.bankTransfer' />,</li>
                    <li><FormattedMessage id='landing.HowItWorks.visaOrMastercard' />,</li>
                    <li><FormattedMessage id='landing.HowItWorks.otherPaymentMethods' /></li>
                  </ul>
                  :
                  <p><FormattedMessage id='landing.HowItWorks.secureColdStorage' /></p>
                  }

                </div>
                <div className='order-text'>
                  <h4 className='scheme-title'>
                    <FormattedMessage id='landing.HowItWorks.placeOrder' />
                  </h4>
                  <p>
                    <FormattedMessage id='landing.HowItWorks.tradeMoreCryptocurrencies.firstPart' />
                    <br/>
                    <FormattedMessage id='landing.HowItWorks.tradeMoreCryptocurrencies.secondPart' />
                  </p>
                </div>
              </div>
            </div>

            <div className='exchanges-container'>
              <div className='arrow-path--horizontal' />
              <div className='arrow-path--vertical' />
              <ExchangeList/>
              <div className='algorithm'>
                <ReactSVG src={AlgorithmSVG} />
                <h4 className='scheme-title'>
                  <FormattedMessage id='landing.HowItWorks.smartOrderRouting' />
                  <br/>
                  <FormattedMessage id='landing.HowItWorks.bestExecution' />
                </h4>
              </div>
            </div>

            <div className='border-bottom__container'>
              <div className='border-bottom border-bottom--right' />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default HowItWorksDesktop;
