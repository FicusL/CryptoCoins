import * as React from 'react';

export class Credits extends React.Component {
  render() {
    return (
      <div className='col nav-bar__powered-by'>
        <a href='http://zichain.io/' target='_blank' rel='noopener noreferrer'>
          powered by Zichain
        </a>
      </div>
    );
  }
}

