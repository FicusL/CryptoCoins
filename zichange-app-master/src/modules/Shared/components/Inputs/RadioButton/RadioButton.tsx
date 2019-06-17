import './style.scss';
import React from 'react';
import cn from 'classnames';
import { IOnChangeProps } from '../../../types/IChangeProps';
import { FieldsStore } from '../../../../Admin/modules/Counterparty/stores/Colors/FieldsStore';
import { RGBA } from '../../../types/IRGBA';
import { observer } from 'mobx-react';

interface IRadioBtnProps {
  name: string;
  value?: string;
  label?: string;
  onChange?: (changeProps: IOnChangeProps) => void;
  checked?: boolean;
  showError?: boolean;
  disabled?: boolean;
  classNames?: string;
  colors?: FieldsStore;
}

@observer
export default class RadioButton extends React.Component<IRadioBtnProps> {

  handleChange = ({ target: { name, value }}) => {
    if (this.props.onChange) {
      this.props.onChange({ name, value });
    }
  };

  render() {
    const {label, onChange, checked, showError, colors, ...props} = this.props;

    return (
      <div className={cn('radio-btn', this.props.classNames)}>
        <label className={cn('radio-btn__container', {'error': showError})}>
          {colors ?
            <>
              <span
                style={{ color: RGBA.toRGBAString(colors.color) }}>
                {label}
              </span>
              <input
                type='radio'
                checked={checked}
                onChange={this.handleChange}
                {...props}
              />
              <span style={{border: `${RGBA.toRGBAString(colors.borderColor)} ${colors.borderSize}px solid`}}
                    className='radio-btn__check-mark-custom'>
                {checked
                  ? <span style={{
                    border: `4px solid ${RGBA.toRGBAString(colors.borderColor)}`,
                    backgroundColor: RGBA.toRGBAString(colors.borderColor),
                    display: 'block'}}
                    className='radio-btn__check-mark-custom-active' />
                  : null
                }
              </span>
            </>
            :
            <>
              <span>
                {label}
              </span>
              <input
                type='radio'
                checked={checked}
                onChange={this.handleChange}
                {...props}
              />
              <span className='radio-btn__check-mark' />
            </>
          }
        </label>
      </div>
    );
  }
}