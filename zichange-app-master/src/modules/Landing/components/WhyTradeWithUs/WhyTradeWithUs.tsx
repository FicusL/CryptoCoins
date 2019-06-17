import * as React from 'react';
import './style.scss';
import LawImage from './assets/advantage-law.png';
import ClipBoardImage from './assets/advantage-clipboard.png';
import CaseImage from './assets/advantage-case.png';
import MoneyImage from './assets/advantage-money.png';
import CreditCardImage from './assets/advantage-credit-card.png';
import BrowserImage from './assets/advantage-browser.png';
import LandingButton from '../LandingButton/LandingButton';
import { RouteComponentProps, withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import TextFormat from '../../../Shared/components/TextFormats/TextFormat';

class WhyTradeWithUs extends React.Component<RouteComponentProps> {

  handleClick = () => {
    this.props.history.replace('/register');
  };

  render() {
    return (
      <section className='advantages'>
        <div className='container'>
          <div className='advantages__container'>
            <h2 className='advantages__title col-12'>
              <FormattedMessage id='landing.whyTradeWithUs.title' />
            </h2>

            <div className='advantages__list row'>
              <div className='advantages__list__item col-12 col-lg-6'>
                <div className='advantages__list__item__icon'>
                  <img src={LawImage}/>
                </div>

                <div className='advantages__list__item__description'>
                  <span className='title'>
                    <FormattedMessage id='landing.whyTradeWithUs.regulatedExchange.title' />
                  </span>
                  <p className='text'>
                    <FormattedMessage id='landing.whyTradeWithUs.regulatedExchange.description' />
                  </p>
                </div>
              </div>

              <div className='advantages__list__item col-12 col-lg-6'>
                <div className='advantages__list__item__icon'>
                  <img src={ClipBoardImage}/>
                </div>

                <div className='advantages__list__item__description'>
                  <span className='title'>
                    <FormattedMessage id='landing.whyTradeWithUs.hugeSelectionOfCoins.title' />
                  </span>
                  <p className='text'>
                    <FormattedMessage id='landing.whyTradeWithUs.hugeSelectionOfCoins.description' />
                  </p>
                </div>
              </div>

              <div className='advantages__list__item col-12 col-lg-6'>
                <div className='advantages__list__item__icon'>
                  <img src={CaseImage}/>
                </div>

                <div className='advantages__list__item__description'>
                  <span className='title'>
                    <FormattedMessage id='landing.whyTradeWithUs.professionalServices.title' />
                  </span>
                  <p className='text'>
                    <FormattedMessage id='landing.whyTradeWithUs.professionalServices.description' />
                  </p>
                </div>
              </div>

              <div className='advantages__list__item col-12 col-lg-6'>
                <div className='advantages__list__item__icon'>
                  <img src={MoneyImage}/>
                </div>

                <div className='advantages__list__item__description'>
                  <span className='title'>
                    <FormattedMessage id='landing.whyTradeWithUs.deepLiquidity.title' />
                  </span>
                  <p className='text'>
                    <FormattedMessage id='landing.whyTradeWithUs.deepLiquidity.description' />
                  </p>
                </div>
              </div>

              <div className='advantages__list__item col-12 col-lg-6'>
                <div className='advantages__list__item__icon'>
                  <img src={CreditCardImage}/>
                </div>

                <div className='advantages__list__item__description'>
                  <span className='title'>
                    <FormattedMessage id='landing.whyTradeWithUs.swiftTransactions.title' />
                  </span>
                  <p className='text'>
                    <FormattedMessage id='landing.whyTradeWithUs.swiftTransactions.description' />
                  </p>
                </div>
              </div>

              <div className='advantages__list__item col-12 col-lg-6'>
                <div className='advantages__list__item__icon'>
                  <img src={BrowserImage}/>
                </div>

                <div className='advantages__list__item__description'>
                  <span className='title'>
                    <FormattedMessage id='landing.whyTradeWithUs.comfortableTrading.title' />
                  </span>
                  <p className='text'>
                    <FormattedMessage id='landing.whyTradeWithUs.comfortableTrading.description' />
                  </p>
                </div>
              </div>
            </div>

            <div className='col-12 text--center'>
              <LandingButton name='active' onClick={this.handleClick}>
                <TextFormat id='landing.getStarted' />
              </LandingButton>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withRouter(WhyTradeWithUs);
