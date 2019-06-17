import * as React from 'react';
import classNames from 'classnames';
import './style.scss';
import { lazyInject } from '../../../IoC';
import { SessionStore } from '../../stores/SessionStore';
import { observer } from 'mobx-react';
import { RGBA } from '../../types/IRGBA';
import { FieldsStore } from '../../../Admin/modules/Counterparty/stores/Colors/FieldsStore';
import { CSSProperties } from 'react';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: any;
  className?: string;
  name?: 'default' | 'transparent' | 'white' | 'dark' | 'sell' | 'currency' | 'modal' | 'fluid' | 'delete';
  style?: CSSProperties;
  colors?: FieldsStore;
}

@observer
export default class Button extends React.Component<IButtonProps> {

  @lazyInject(SessionStore)
  sessionStore: SessionStore;

  public render() {
    const { className, children, name, colors, style, ...props} = this.props;
    return(
      <>
        {colors ?
          <button style={{...style, backgroundColor: RGBA.toRGBAString(colors.backgroundColor),
                          color: RGBA.toRGBAString(colors.color),
                          boxShadow: `0 5px 30px 0 ${RGBA.toRGBAString(colors.boxShadow)}`,
                          border: `${RGBA.toRGBAString(colors.borderColor)} ${colors.borderSize}px solid`}}
                  className={classNames(className, 'dashboard-btn', `dashboard-btn--${name}`)} {...props}>
            {children}
          </button>
          :
          <button className={classNames(className, 'dashboard-btn', `dashboard-btn--${name}`)} {...props}>
            {children}
          </button>
        }
      </>
    );
  }
}