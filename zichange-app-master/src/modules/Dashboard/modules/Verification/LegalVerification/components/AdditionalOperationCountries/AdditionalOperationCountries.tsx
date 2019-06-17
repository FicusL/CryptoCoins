import * as React from 'react';
import './style.scss';
import { IOnChangeProps } from '../../../../../../Shared/types/IChangeProps';
import { observer } from 'mobx-react';
import SelectSearch from '../../../../../../Shared/components/Inputs/SelectSearch';
import { Countries } from '../../../../../../Shared/const/Countries';
import Button from '../../../../../../Shared/components/Buttons/Button';
import classNames from 'classnames';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { lazyInject } from '../../../../../../IoC';
import { LocaleStore } from '../../../../../../Shared/stores/LocaleStore';

interface IProps {
  name: string;
  onChange: (ChangeProps: IOnChangeProps) => void;
  value: string[];
}

interface IState {
  additionalOperationCountries: string[];
}

@observer
class AdditionalOperationCountries extends React.Component<IProps & InjectedIntlProps, IState> {
  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  constructor(props) {
    super(props);

    this.state = {
      additionalOperationCountries: this.props.value || [],
    };
  }

  handleChange = (operationCountriesArray: string[]) => {
    this.setState( { additionalOperationCountries: operationCountriesArray });
    this.props.onChange({ name: this.props.name, value: operationCountriesArray });
  };

  handleElemChange = (index, value) => {
    const operationCountriesCopy = [...this.state.additionalOperationCountries];
    operationCountriesCopy[index] = value;
    this.handleChange(operationCountriesCopy);
  };

  handleAdd = () => {
    const { additionalOperationCountries } = this.state;
    additionalOperationCountries.push('');
    this.handleChange(additionalOperationCountries);
  };

  handleDelete = () => {
    const { additionalOperationCountries } = this.state;
    additionalOperationCountries.pop();
    this.handleChange(additionalOperationCountries);
  };

  getCountry = (name) => Countries.find(item => item.value === name);

  render() {
    const { intl } = this.props;
    const { locale } = this.localeStore;
    const { additionalOperationCountries } = this.state;

    return (
      <div className='mb-4'>
        {additionalOperationCountries.length > 0 &&
          <>
            {additionalOperationCountries.map((country, i) => (
              <div key={i} className='row operation-country__container mb-4 mt-2'>
                <SelectSearch
                  label={intl.formatMessage({
                    id: 'dashboard.kyc.legal.additional.operations.countries.search.label',
                    defaultMessage: 'Country of operation',
                  })}
                  options={Countries}
                  placeholder={intl.formatMessage({
                    id: 'dashboard.kyc.legal.additional.operations.countries.search.placeholder',
                    defaultMessage: 'Select the operation country',
                  })}
                  onChange={({ value }) => this.handleElemChange(i, value)}
                  value={this.getCountry(country)}
                  className='col-10 m-0 p-0 pr-3'
                />
                <div className={classNames('col-2 d-flex align-items-end justify-content-center',
                  locale === 'ru' ? 'item-layout__btn-delete' : 'p-0')}
                >
                  <Button name='delete' onClick={this.handleDelete}/>
                </div>

              </div>
            ))}
          </>
        }
        <Button name='default' onClick={this.handleAdd}>
          {intl.formatMessage({
            id: 'dashboard.kyc.legal.management.personal.data.button',
            defaultMessage: 'Add',
          })}
        </Button>
      </div>
    );
  }
}

export default injectIntl(AdditionalOperationCountries);
