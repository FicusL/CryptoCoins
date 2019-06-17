import * as React from 'react';
import classNames from 'classnames';
import InputMask from 'react-input-mask';
import './style.scss';

interface IProps {
  name: string;
  balance: string;
  label?: string;
  className?: string;
  value?: any;
  onChange: (props) => void;
  placeholder?: string;
  showError?: boolean;
  errorMessage?: string;
  mask?: string;
  maskChar?: string | null;
}


export class InputWithdrawal extends React.Component<IProps> {

  constructor(props: IProps) {
    super(props);
  }

  public handleValueChange = ({ target: { name, value } }) => {
    this.props.onChange({ name: this.props.name, amount: value});
  };

  private handleClick = () => {
    this.props.onChange({ name: this.props.name, amount: this.props.balance });
  };

  public render() {
    const { label, className, onChange, showError, errorMessage, ...props } = this.props;
    const fieldClassName = classNames('form__field', {'form__show-error': showError}, className);

    return (
      <div className={fieldClassName}>
        <label className='form__input__currency__label'>{label}</label>
        <div className='form__input form__input__currency input__currency'>
          <InputMask onChange={this.handleValueChange} { ...props } />
          <div className='max-button' onClick={this.handleClick}>
            MAX
          </div>

        </div>
        <span className='form__error-message'>{errorMessage}</span>
      </div>
    );
  }
}