import * as React from 'react';
import './style.scss';
import { FormattedMessage } from 'react-intl';

class ZichangeInfo extends React.Component {

  render() {
    return (
      <section className='zichange-info'>
        <div className='container'>
          <div className='zichange-info__container row'>
            <div className='zichange-info__title col-lg-5'>
              <h2>ZiChange</h2>
            </div>

            <div className='zichange-info__description col-lg-7'>
              <p className='zichange-info__description__text'>
                <span className='zichange-info__description__text__title'>ZiChange </span>
                <FormattedMessage id='landing.zichangeInfo.description' />
              </p>

              <p className='zichange-info__description__fixed-exchange'>
                <FormattedMessage id='landing.zichangeInfo.exchangeFee.fixed' />
                <span className='percent'> 0.7% </span>
                <FormattedMessage id='landing.zichangeInfo.exchangeFee.fee' />
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ZichangeInfo;
