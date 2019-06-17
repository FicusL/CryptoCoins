import './style.scss';
import cn from 'classnames';
import { FieldsStore } from '../../../../Admin/modules/Counterparty/stores/Colors/FieldsStore';
import { RGBA } from '../../../types/IRGBA';
import { observer } from 'mobx-react';
import React from 'react';

interface ICheckboxProps {
  name: string;
  label: string;
  onChange: any;
  className?: string;
  checked?: boolean;
  showError?: boolean;
  disabled?: boolean;
  colors?: FieldsStore;
}

@observer
export default class CheckBox extends React.Component<ICheckboxProps> {

  handleChange = ({ target: { name, checked }}: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      this.props.onChange({ name, value: checked });
    }
  };

  render() {
    const {label, onChange, checked, showError, className, colors, disabled, ...props} = this.props;

    return (
      <div className={'checkbox ' + className}>
        <label className={cn('checkbox__container', {'error': showError}, {'form__show-error': showError })}>
          { colors
            ? <>
                <span style={!showError ? { color: RGBA.toRGBAString(colors.color) } : {}}>
                  {label}
                </span>
                <input
                  type='checkbox'
                  checked={checked}
                  onChange={this.handleChange}
                  {...props}
                />
                <span style={!showError
                  ? {border: `${RGBA.toRGBAString(colors.borderColor)} ${colors.borderSize}px solid`}
                  : {borderColor: '#f00'}}
                      className='checkbox__check-mark-custom'
                >
                  {checked
                    ? <span style={{
                      borderColor: RGBA.toRGBAString(colors.borderColor),
                      borderWidth: '0 4px 4px 0',
                      display: 'block'}}
                      className='checkbox__check-mark-custom-active' />
                    : null
                  }
                </span>
              </>
            : <>
                <span>{label}</span>
                <input
                  type='checkbox'
                  checked={checked}
                  onChange={this.handleChange}
                  {...props}
                />
                <span className='checkbox__check-mark'/>
              </>
          }
        </label>
      </div>
    );
  }
}