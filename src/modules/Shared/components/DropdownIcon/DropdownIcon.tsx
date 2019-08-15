import './style.scss';
import * as React from 'react';
import cn  from 'classnames';

interface IProps {
  className?: string;
  rotated?: boolean;
  top?: string;
  left?: string;
  right?: string;
}

class DropdownIcon extends React.Component<IProps> {

  render() {
    const { rotated, left, right, top, className } = this.props;
    return (
      <span
        className={cn('dropdown-icon', className, { 'opened': rotated })}
        style={{ top, left, right }}
      />
    );
  }
}

export default DropdownIcon;