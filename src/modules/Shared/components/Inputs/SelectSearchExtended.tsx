import * as React from 'react';
import { observer } from 'mobx-react';
import { FieldsStore } from '../../../Admin/modules/Counterparty/stores/Colors/FieldsStore';
import classNames from 'classnames';

interface IProps {
  className?: string;
  label?: string;
  onChange?: (ISelectInputProps) => void;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  errorMessage?: string;
  showError?: boolean;
  value?: any;
  colors?: FieldsStore;
}

@observer
class SelectSearchExtended extends React.Component<IProps> {

  render() {

    const { showError, className, label, placeholder, options } = this.props;

    return(
      <div className={classNames('form__field', {'form__show-error': showError}, className)}>
        { label && label.length > 0 ? <label className='form__label'>{label}</label> : null }

        <div className='select-search-extended'>
          <select>
            <option selected disabled>{placeholder && placeholder.length > 0 ? placeholder : null}</option>
            { options && options.map((option) =>
              <option key={option.label} value={option.value}>
                {option.label}
              </option>)
            }
          </select>
        </div>
      </div>
    );
  }
}

export default SelectSearchExtended;