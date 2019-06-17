import * as React from 'react';
import * as _ from 'lodash';
import classNames from 'classnames';

interface IOption {
  label: string;
  value: any;
}

interface IProps {
  className?: string;
  label?: string;
  name?: string;
  onChange?: (ISelectInputProps) => void;
  options?: IOption[];
  placeholder?: string;
  errorMessage?: string;
  showError?: boolean;
  value?: any;
  forceDropdown?: boolean;
}

export default class Select extends React.Component<IProps> {
  state = {opened: false, selected: null};

  constructor(props) {
    super(props);
    if (_.has(props, 'value')) {
      const selectedOption = _.find(props.options, option => option.value === props.value);
      if (selectedOption) {
        this.state.selected = selectedOption.label;
      }
    }
  }

  componentDidUpdate(prevProps: IProps, prevState, snapshot) {
    if (prevProps.value !== this.props.value || prevProps.options !== this.props.options) {
      const selectedOption = _.find(this.props.options, option => option.value === this.props.value);
      if (selectedOption) {
        this.setState({ selected: selectedOption.label });
      }
    }
  }

  handleChange = ({label, value}) => {
    // TODO: delete this shit
    if (typeof value === 'function') {
      value();
    }
    this.setState({opened: false, selected: label});
    _.invoke(this.props, 'onChange', {...this.props, value});
  };

  toggleSelect = () => {
    this.setState({opened: !this.state.opened});
  };

  isListening = false;
  hideOnClickOutside(element) {
    if (this.isListening) {
      return;
    }

    const outsideClickListener = event => {
      if (element && !element.contains(event.target) && this.state.opened) {
         this.setState({opened: false});
      }
    };

    document.addEventListener('click', outsideClickListener);
    this.isListening = true;
  }

  render() {
    const {label, className, options, placeholder, showError, errorMessage, forceDropdown} = this.props;
    const cn = classNames('form__field', {'form__show-error': showError}, className);
    const selected = (this.state.selected !== null) ? this.state.selected : placeholder;

    const showDropdown = forceDropdown || (options && options.length > 1);

    return (
      <div className={cn}>
        {label && label.length > 0 ? <label className='form__label'>{label}</label> : null }

        <div className='form__input form__select' ref={ref => this.hideOnClickOutside(ref)}>
          <div className='form__select-placeholder' onClick={this.toggleSelect}>
            <span>{selected}</span>
            { showDropdown
              ? <span className={classNames('form__select-icon', {'opened': this.state.opened})} />
              : null
            }
          </div>
          <ul className={classNames('form__select-options',
            { 'opened': this.state.opened &&  showDropdown })}
          >
            {_.map(options, (option, i) => (
              <li
                key={i}
                className='option'
                onClick={() => this.handleChange(option)}
              >{option.label}</li>
            ))}
          </ul>
        </div>
        <span className='form__error-message'>{errorMessage}</span>
      </div>
    );
  }
}