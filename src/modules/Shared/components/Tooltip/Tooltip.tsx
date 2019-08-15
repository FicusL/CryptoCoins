import './style.scss';
import * as React from 'react';
import PropTypes from 'prop-types';

interface IProps {
  text: string;
}

export default class Tooltip extends React.Component<IProps> {

  static propTypes = {
    text: PropTypes.string,
  };

  render() {
    const {text} = this.props;

    return (
      <div className='tooltip-trigger'>
          {this.props.children}
        <span className='tooltip-content'>{text}</span>
      </div>
    );
  }
}