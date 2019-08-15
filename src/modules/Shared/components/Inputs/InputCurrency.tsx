import * as React from 'react';
import classNames from 'classnames';

import './style.scss';
import Select from './Select';
import { observer } from 'mobx-react';

interface ICurrencyInputChangeProps {
  name: string;
  amount: string;
  currency: string;
}

interface IProps {
  name: string;
  currencies: string[];
  label?: string;
  className?: string;
  value?: any;
  onChange: (props: ICurrencyInputChangeProps) => void;
  placeholder?: string;
  showError?: boolean;
  errorMessage?: string;
}

interface IState {
  amount: string;
  currency: string;
}

@observer
export class InputCurrency extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      amount: '0',
      currency: props.currencies[0],
    };
  }

  public handleValueChange = ({ target: { name, value } }) => {
    this.setState({ amount: value });
    this.props.onChange({ name, amount: value, currency: this.state.currency });
  };

  private handleCurrencyChange = ({ value }) => {
    this.setState({ currency: value });
    this.props.onChange({ name: this.props.name, currency: value, amount: this.state.amount });
  };

  public render() {

    const { label, currencies, className, onChange, showError, errorMessage, ...props } = this.props;
    const fieldClassName = classNames('form__field', {'form__show-error': showError}, className);

    const options = currencies.map(currency => ({ value: currency, label: currency }));

    return (
      <div className={fieldClassName}>
        <label className='form__input__currency__label'>{label}</label>
        <div className='form__input form__input__currency input__currency'>
          <input type='text' onChange={this.handleValueChange} { ...props } />
          <Select
            className='select__currency'
            value={this.state.currency}
            onChange={this.handleCurrencyChange}
            options={options}
          />
        </div>
        <span className='form__error-message'>{errorMessage}</span>
      </div>
    );
  }
}
