import './style.scss';
import * as React from 'react';

interface IProps {
  top?: string;
  left?: string;
  right?: string;
  className?: string;
  onClick?: () => void;
}

class CloseIcon extends React.Component<IProps> {

  render() {
    const { className, top, left, right, onClick } = this.props;

    return (
      <div className={`close-icon ${className}`} style={{ top, left, right }} onClick={onClick}>
          <span />
          <span />
      </div>
    );
  }
}

export default CloseIcon;