import * as React from 'react';
import './style.scss';
import ReactSVG from 'react-svg';

interface IProps {
  icon: string;
  label?: string;
}

class ExchangeIcon extends React.Component<IProps> {
  render() {
    return (
      <div className='exchange-icon__container'>
        <div className='exchange-icon'>
          <ReactSVG src={this.props.icon} />
        </div>
        <span className='exchange-icon__label'>{this.props.label}</span>
      </div>
    );
  }
}

export default ExchangeIcon;
