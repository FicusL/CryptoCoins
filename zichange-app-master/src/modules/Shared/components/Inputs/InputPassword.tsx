import './style.scss';
import * as React from 'react';
import classNames from 'classnames';

interface IProps {
  name: string;
  label?: string;
  className?: string;
  value?: string;
  onChange: (Props) => void;
  placeholder?: string;
  showSwitcher?: boolean;
  showError?: boolean;
  errorMessage?: string;
  autoComplete?: string;
}

export default class InputPassword extends React.Component<IProps> {
  public state = { isPasswordVisible: false };

  public handleChange = ({target: {value}}) => {
    this.props.onChange({ ...this.props, value });
  };

  public toggleVisibility = () => this.setState({isPasswordVisible: !this.state.isPasswordVisible});

  public render() {
    const { label, className, onChange, showSwitcher, showError, errorMessage, ...props } = this.props;
    const fieldClassName = classNames('form__field', {'form__show-error': showError}, className);

    const {isPasswordVisible} = this.state;

    return (
      <div className={fieldClassName}>
        <label className='form__label'>{label}</label>
        <div className='form__input'>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            onChange={this.handleChange}
            {...props}
          />
          {showSwitcher &&
          <span
            className={classNames('pass-switcher', {'pass-switcher--active': isPasswordVisible})}
            onClick={this.toggleVisibility}
          />
          }
        </div>
        <span className='form__error-message'>{errorMessage}</span>
      </div>
    );
  }
}