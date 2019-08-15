import * as React from 'react';
import ReactSelect from 'react-select';
import classNames from 'classnames';
import './style.scss';
import { observer } from 'mobx-react';
import { RGBA } from '../../types/IRGBA';
import { CSSProperties } from 'react';
import { SelectSearchFieldsStore } from '../../../Admin/modules/Counterparty/stores/Colors/SelectSearchFieldsStore';

interface ISelectSearchProps {
  className?: string;
  label?: string;
  name?: string;
  onChange?: (ISelectInputProps) => void;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  errorMessage?: string;
  showError?: boolean;
  value?: any;
  colors?: SelectSearchFieldsStore;
  style?: CSSProperties;
}

interface ISearchSelectState {
  selectedOption: string | null;
}

@observer
export default class SelectSearch extends React.Component<ISelectSearchProps, ISearchSelectState> {
  state = { selectedOption: null };

  constructor(props) {
    super(props);

    if (this.props.value && this.props.options) {
      const selectedOption = this.props.options.find(option => option.value === props.value);

      if (selectedOption) {
        // @ts-ignore
        this.state.selectedOption = selectedOption;
      }
    }
  }

  handleChange = (option) => {
    const value = option ? option.value : null;
    this.props.onChange && this.props.onChange({...this.props, value });
  };

  public render() {
    const { label, className, options, placeholder, showError, errorMessage, colors, value } = this.props;

    const colorsStyles = {
      control: base => ({
        ...base,
        backgroundColor: RGBA.toRGBAString(colors.control.backgroundColor),
        color: RGBA.toRGBAString(colors.control.color),
        borderRadius: 4,
        border: `${RGBA.toRGBAString(colors.control.borderColor)} ${colors.control.borderSize}px solid`,
        height: '45px',
        ...this.props.style,
      }),
      singleValue: base => ({ ...base, color: RGBA.toRGBAString(colors.singleValue.color) }),
      menu: base => ({ ...base, color: RGBA.toRGBAString(colors.menu.color), backgroundColor: RGBA.toRGBAString(colors.menu.backgroundColor) }),
    };

    return (
      <div className={classNames('form__field', {'form__show-error': showError}, className)}>
        {label && label.length > 0 ? <label className='form__label'>{label}</label> : null }

        {colors ?
          <ReactSelect
            value={value}
            onChange={this.handleChange}
            options={options}
            isSearchable
            placeholder={placeholder}
            styles={colorsStyles}
            theme={theme => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: RGBA.toRGBAString(colors.themes.primary25),
                primary50: RGBA.toRGBAString(colors.themes.primary50),
                primary: RGBA.toRGBAString(colors.themes.primary),
              },
            })}
          />
        : <ReactSelect
            value={value}
            onChange={this.handleChange}
            options={options}
            isSearchable
            placeholder={placeholder}
            styles={{
              control: base => ({
                ...base,
                backgroundColor: '#3b4850',
                color: 'white',
                borderRadius: 4,
                border: '2px solid grey',
                height: '45px',
              }),
              singleValue: base => ({ ...base, color: 'white' }),
              menu: base => ({ ...base, color: 'white', backgroundColor: '#3b4850' }),
            }}
            theme={theme => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: 'rgba(255, 255, 255, 0.35)',
                primary50: 'rgba(255, 255, 255, 0.35)',
                primary: 'rgba(255, 255, 255, 0.35)',
                neutral80: 'white',
              },
            })}
          />
        }

        <span className='form__error-message'>{errorMessage}</span>
      </div>
    );
  }
}
