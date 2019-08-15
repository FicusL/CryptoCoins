import * as React from 'react';
import { Countries } from '../../../../../../Shared/const/Countries';
import CheckBox from '../../../../../../Shared/components/Inputs/Checkbox/Checkbox';
import Button from '../../../../../../Shared/components/Buttons/Button';
import { IOnChangeProps } from '../../../../../../Shared/types/IChangeProps';
import { observer } from 'mobx-react';
import SelectSearch from '../../../../../../Shared/components/Inputs/SelectSearch';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { lazyInject } from '../../../../../../IoC';
import { LocaleStore } from '../../../../../../Shared/stores/LocaleStore';
import { CounterpartyAccountStore } from '../../../../../../Counterparty/stores/CounterpartyAccountStore';
import { ColorStore } from '../../../../../../Admin/modules/Counterparty/stores/Colors/ColorStore';

interface IProps {
  name: string;
  onChange: (ChangeProps: IOnChangeProps) => void;
  value: string[];
}

interface IState {
  differenceCitizenship: boolean;
  additionalCitizens: string[];
}

@observer
class AdditionalCitizenship extends React.Component<IProps & InjectedIntlProps, IState> {
  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  @lazyInject(ColorStore)
  colorStore: ColorStore;

  @lazyInject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  constructor(props) {
    super(props);

    this.state = {
      differenceCitizenship: this.props.value.length > 0,
      additionalCitizens: this.props.value,
    };
  }

  handleChange = (citizensArray: string[]) => {
    if (citizensArray.length < 1) {
      this.setState( { differenceCitizenship: false });
    }
    this.setState( { additionalCitizens: citizensArray });
    this.props.onChange({ name: this.props.name, value: citizensArray });
  };

  handleCheckBoxClick = ({ value }) => {
    this.setState({
      differenceCitizenship: value,
      additionalCitizens: [''],
    });
    this.props.onChange({ name: this.props.name, value: [] });
  };

  handleElemChange = (index, value) => {
    const citizensCopy = [...this.state.additionalCitizens];
    citizensCopy[index] = value;
    this.handleChange(citizensCopy);
  };

  handleAdd = () => {
    const { additionalCitizens } = this.state;
    additionalCitizens.push('');
    this.handleChange(additionalCitizens);
  };

  handleDelete = (index) => {
    const { additionalCitizens } = this.state;
    additionalCitizens.splice(index, 1);
    this.handleChange(additionalCitizens);
  };

  getCountry = (name) => Countries.find(item => item.value === name);

  render() {
    const { differenceCitizenship, additionalCitizens } = this.state;
    
    const { differentCitizenshipLabel, countryOfCitizenshipLabel,
            countryOfCitizenshipPlaceholder, countryOfCitizenshipButton,
            differentCitizenshipDefinition,
          } = this.getLocalizedData();

    return (
      <>
        <div className='col-12'>
          <CheckBox
            name='differenceCitizenship'
            checked={differenceCitizenship}
            label={differentCitizenshipLabel}
            onChange={this.handleCheckBoxClick}
          />
        </div>
        {differenceCitizenship && additionalCitizens.length > 0 &&
          <div className='container p-0'>
            <p className='header_description col-12 mb-3 mt-3'>
              {differentCitizenshipDefinition}
            </p>
            {additionalCitizens.map((citizenship, i) => (
              <div key={i} className='col-12 row citizenshipContainer mt-3'>
                <SelectSearch
                  label={countryOfCitizenshipLabel}
                  options={Countries}
                  placeholder={countryOfCitizenshipPlaceholder}
                  onChange={({ value }) => this.handleElemChange(i, value)}
                  value={this.getCountry(citizenship)}
                  className='col-10 mt-0 p-0 pr-3'
                  colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.selectSearch}
                />
                <div className='col-2 d-flex align-items-center justify-content-center'>
                  <Button name='delete'
                          colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.button}
                          onClick={() => this.handleDelete(i)}/>
                </div>
              </div>
            ))}
            <div className='col-12 d-flex justify-content-center mt-4'>
              <Button name='default'
                      colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.button}
                      onClick={this.handleAdd}>{countryOfCitizenshipButton}</Button>
            </div>
          </div>
        }
      </>
    );
  }
  getLocalizedData() {
    const { intl } = this.props;
    const differentCitizenshipLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.differentCitizenshipLabel',
      defaultMessage: 'Is your Country of Citizenship different from Country of Residence?',
    });
    const countryOfCitizenshipLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.countryOfCitizenshipLabel',
      defaultMessage: 'Country of Citizenship',
    });
    const countryOfCitizenshipPlaceholder = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.countryOfCitizenshipPlaceholder',
      defaultMessage: 'Select the country of your Citizenship',
    });
    const countryOfCitizenshipButton = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.countryOfCitizenshipButton',
      defaultMessage: 'Add Additional Citizenship',
    });
    const differentCitizenshipDefinition = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.differentCitizenshipDefinition',
      defaultMessage: 'Enter all countries you are a full citizen of. Start with your primary citizenship first.',
    });

    return {
      differentCitizenshipLabel, countryOfCitizenshipLabel,
      countryOfCitizenshipPlaceholder, countryOfCitizenshipButton,
      differentCitizenshipDefinition,
    };
  }

}

export default injectIntl(AdditionalCitizenship);