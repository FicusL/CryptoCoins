import * as React from 'react';
import './style.scss';

class ArrowMobile extends React.Component {

  render() {
    return (
      <div className='arrow-mobile'>
        <div className='arrow-mobile__path' />
        <div className='arrow arrow--down' />
      </div>
    );
  }
}

export default ArrowMobile;