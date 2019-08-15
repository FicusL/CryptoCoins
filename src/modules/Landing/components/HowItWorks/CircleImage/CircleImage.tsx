import * as React from 'react';
import './style.scss';
import ReactSVG from 'react-svg';
import { FormattedMessage } from 'react-intl';

interface IProps {
  img: string;
}

class CircleImage extends React.Component<IProps> {
  render() {
    return (
      <div className='circle-image'>
        <div className='circle-image__container'>
          <div>
            <ReactSVG src={this.props.img}/>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default CircleImage;
