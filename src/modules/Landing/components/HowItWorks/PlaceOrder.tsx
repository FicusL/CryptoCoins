import * as React from 'react';
import LandingButton from '../LandingButton/LandingButton';

class PlaceOrder extends React.Component {
  render() {
    return (
      <div>
        <div className='place-order'>
          <div className='deposit__right-arrow' />
          <LandingButton>Buy</LandingButton>
          <div className='deposit__right-arrow' />
        </div>
        <div className='place-order__text'>
          <h4>Place order</h4>
        </div>
      </div>
    );
  }
}

export default PlaceOrder;
