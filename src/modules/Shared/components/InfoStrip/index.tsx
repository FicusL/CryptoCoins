import './style.scss';
import CurrentLocation from './CurrentLocation';
import * as React from 'react';
import AccountLevel from './AccountLevel';
import ExchangeRate from './ExchangeRate';


export default class InfoStrip extends React.Component {

  render() {

    return (
      <div className='info-strip'>
        <div className='container'>
          <div className='row align-items-center info-strip__container'>
            <div className='col-12 col-md-4 col-lg-4 text-center text-md-left'>
              <h1 className='header text--bold'>
                <CurrentLocation/>
              </h1>
            </div>

            <div className='col-12 col-md-4 col-lg-3 text--center'>
              <AccountLevel />
            </div>

            <div className='col-12 col-md-4 col-lg-5 text-center text-md-right'>
              <ExchangeRate />
            </div>

          </div>
        </div>
      </div>
    );
  }
}