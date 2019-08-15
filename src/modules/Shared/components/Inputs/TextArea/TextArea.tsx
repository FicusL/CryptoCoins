import './style.scss';
import * as React from 'react';
import classNames from 'classnames';
import { IOnChangeProps } from '../../../types/IChangeProps';
import { observer } from 'mobx-react';


interface IProps {
  name: string;
  label?: string;
  className?: string;
  value?: string;
  onChange: (changeProps: IOnChangeProps) => void;
  placeholder?: string;
  showError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

@observer
export default class TextArea extends React.Component<IProps> {

  public handleChange = ({target: { value }}) => {
    this.props.onChange({ name: this.props.name, value });
  };

  public render() {
    const {label, className, onChange, showError, errorMessage, ...props} = this.props;
    const cn = classNames(
      'form__field',
      'text-area',
      {'form__show-error': showError},
      className,
    );

    return (
      <div className={cn}>
        {label && label.length > 0 ? <label className='form__label'>{label}</label> : null }
        <div className={classNames('form__input', {'disabled': props.disabled})}>
          <textarea className='text-area__scroll' {...props} onChange={this.handleChange} />
        </div>
        <span className='form__error-message'>{errorMessage}</span>
      </div>
    );
  }
}
