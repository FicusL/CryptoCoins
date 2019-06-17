import './style.scss';
import * as React from 'react';
import classNames from 'classnames';
import InputMask from 'react-input-mask';
import * as _ from 'lodash';
import { InputHTMLAttributes } from 'react';
import { RGBA } from '../../types/IRGBA';
import { FieldsStore } from '../../../Admin/modules/Counterparty/stores/Colors/FieldsStore';
import { observer } from 'mobx-react';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  action?: object;
  showError?: boolean;
  errorMessage?: string;
  mask?: string;
  maskChar?: string | null;
  onChange?: (props) => void;
  labelClassNames?: string;
  inputClassNames?: string;
  colors?: FieldsStore;
}

@observer
export default class Input extends React.Component<IInputProps> {

  public handleChange = ({target: {value}}) => {
    _.invoke(this.props, 'onChange', { ...this.props, value });
  };

  public render() {
    const {label, className, action, showError, errorMessage, labelClassNames, colors, ...props} = this.props;
    const cn = classNames(
      'form__field',
      {'form__show-error': showError},
      className,
    );
    const isHasLabel = !!label;

    return (
      <div className={cn}>
        {label && label.length > 0 ? <label className={`form__label ${labelClassNames}`}>{label}</label> : null }
        {colors ?
          <div style={{backgroundColor: `${RGBA.toRGBAString(colors.backgroundColor)}`,
                       color: `${RGBA.toRGBAString(colors.color)}`,
                       boxShadow: `0 5px 30px 0 ${RGBA.toRGBAString(colors.boxShadow)}`,
                       border: `${RGBA.toRGBAString(colors.borderColor)} ${colors.borderSize}px solid`}}
               className={classNames(`form__input`)}>
            <InputMask {...props} onChange={this.handleChange} />
            {action}
          </div>
          :
          <div className={classNames(`form__input`, {'disabled': props.disabled})}>
            <InputMask {...props} onChange={this.handleChange} />
            {action}
          </div>
        }

        <span className={classNames('form__error-message', {'form__error-message--low': !isHasLabel})}>
          {errorMessage}
        </span>
      </div>
    );
  }
}