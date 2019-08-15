import * as React from 'react';
import classNames from 'classnames';
import './style.scss';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  className?: string;
  name?: 'default' | 'active';
}

export default class LandingButton extends React.Component<IButtonProps> {
  public render() {
    const { className, children, name, ...props} = this.props;
    return(
      <button className={classNames(className, 'landing-btn', `landing-btn--${name || 'default'}`)} {...props}>
        {children}
      </button>
    );
  }
}