import * as React from 'react';
import { Countries } from '../../../../../../Shared/const/Countries';
import { IOnChangeProps } from '../../../../../../Shared/types/IChangeProps';
import { observer } from 'mobx-react';
import { IErrors, IValues } from '../../../../../../Shared/stores/Forms/BaseFormStore';
import { PersonalInformationValues } from '../../stores/parts/PersonalInformationStore';
import SelectSearch from '../../../../../../Shared/components/Inputs/SelectSearch';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { lazyInject } from '../../../../../../IoC';
import { LocaleStore } from '../../../../../../Shared/stores/LocaleStore';
import { CounterpartyAccountStore } from '../../../../../../Counterparty/stores/CounterpartyAccountStore';
import { ColorStore } from '../../../../../../Admin/modules/Counterparty/stores/Colors/ColorStore';

interface IProps {
  handleChange: (changeProps: IOnChangeProps) => void;
  values: IValues<PersonalInformationValues>;
  errors: IErrors<PersonalInformationValues>;
}

@observer
class TaxResidency extends React.Component<IProps & InjectedIntlProps> {
  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  @lazyInject(ColorStore)
  colorStore: ColorStore;

  @lazyInject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  getCountry = (name) => Countries.find(item => item.value === name);

  render() {
    const { handleChange, values, errors } = this.props;

    const { intl } = this.props;
    return (
      <div className='row tier1__form-section'>
        <h2 className='header col-12 mb-4 text--center'>
            {intl.formatMessage({
                id: 'dashboard.kyc.tier1.personalInfo.tax.header',
                defaultMessage: 'Tax Residency',
            })}
        </h2>
        <div className='col-md-12'>
          <SelectSearch
            name='TaxResidenceCountry'
            label={
              intl.formatMessage({
                id: 'dashboard.kyc.tier1.personalInfo.tax.countryLabel',
                defaultMessage: 'Country',
              })
            }
            value={this.getCountry(values.TaxResidenceCountry)}
            options={Countries}
            placeholder={
              intl.formatMessage({
                id: 'dashboard.kyc.tier1.personalInfo.tax.countryPlaceholder',
                defaultMessage: 'Select the country of your tax residence',
              })
            }
            onChange={handleChange}
            showError={!!errors.TaxResidenceCountry}
            errorMessage={errors.TaxResidenceCountry && intl.formatMessage({
              id: errors.TaxResidenceCountry,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.selectSearch}
          />
        </div>
      </div>
    );
  }
}

export default injectIntl(TaxResidency);