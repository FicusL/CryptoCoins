import './style.scss';
import * as React from 'react';
import classNames from 'classnames';
import InputMask from 'react-input-mask';
import numeral from 'numeral';
import { FieldsStore } from '../../../Admin/modules/Counterparty/stores/Colors/FieldsStore';
import { RGBA } from '../../types/IRGBA';
import { observer } from 'mobx-react';

interface IInputDateChangeProps {
  name: string;
  value: Date;
}

interface IState {
  value: string;
}

interface IProps {
  name: string;
  label?: string;
  className?: string;
  value?: string;
  onChange: (props: IInputDateChangeProps & { raw: string }) => void;
  mask?: string;
  maskChar?: string | null;
  placeholder?: string;
  showError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  colors?: FieldsStore;
}

@observer
export default class InputDate extends React.Component<IProps, IState> {
  state = { value: '' };

  constructor(props: IProps) {
    super(props);

    const { value } = this.props;
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const dd = numeral(date.getDate()).format('00');
        const mm = numeral(date.getMonth() + 1).format('00');
        const yyyy = numeral(date.getFullYear()).format('0000');

        const inputValue = `${dd}.${mm}.${yyyy}`;
        this.state = { value: inputValue };
      }
    }
  }

  public handleChange = ({target: {value}}) => {
    this.setState({ value });

    const [day, month, year] = value.split('.').map((v) => parseInt(v, 10));

    let date;
    if (day > 31 || month > 12 || year < 1000) {
      date = new Date('-');
    } else {
      date = new Date(year, month - 1, day);
    }

    this.props.onChange({ name: this.props.name, value: date, raw: value });
  };

  public render() {
    const {label, className, showError, errorMessage, colors, ...props} = this.props;
    const cn = classNames('form__field', {'form__show-error': showError}, className);

    return (
      <div className={cn}>
        {label && label.length > 0 ? <label className='form__label'>{label}</label> : null }
        {colors ?
          <div style={{backgroundColor: `${RGBA.toRGBAString(colors.backgroundColor)}`,
                       color: `${RGBA.toRGBAString(colors.color)}`,
                       boxShadow: `0 5px 30px 0 ${RGBA.toRGBAString(colors.boxShadow)}`,
                       border: `${RGBA.toRGBAString(colors.borderColor)} ${colors.borderSize}px solid`}}
               className='form__input'>
            <InputMask {...props}
                       onChange={this.handleChange}
                       value={this.state.value}
            />
          </div> :
          <div className='form__input'>
            <InputMask {...props}
                       onChange={this.handleChange}
                       value={this.state.value}
            />
          </div>
        }

        <span className='form__error-message'>{errorMessage}</span>
      </div>
    );
  }
}