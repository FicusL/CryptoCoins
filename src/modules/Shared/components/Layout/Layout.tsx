import * as React from 'react';
import './style.scss';

export default class Layout extends React.Component {
  public render() {
    return (
      <div className='container layout'>
        {this.props.children}
      </div>
    );
  }
}