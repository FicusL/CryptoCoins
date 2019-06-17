import * as React from 'react';
import { Countries } from '../../../../../../Shared/const/Countries';
import AdditionalCitizenship from './AdditionalCitizenship';
import Input from '../../../../../../Shared/components/Inputs/Input';
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
class Addresses extends React.Component<IProps & InjectedIntlProps> {
  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  @lazyInject(ColorStore)
  colorStore: ColorStore;

  @lazyInject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  getCountry = (name) => Countries.find(item => item.value === name);

  render() {
    const { handleChange, values, errors } = this.props;
    const { residenceCountryLabel, residenceCountryPlaceholder, stateLabel,
            cityLabel, adress1Label, adress1Placeholder,
            adress2Label, adress2Placeholder, zipLabel } = this.getLocalizedData();
    const { intl } = this.props;

    return (
      <div className='row tier1__form-section'>
        <h2 className='header col-12 mb-4 text--center'>
          {intl.formatMessage({
            id: 'dashboard.kyc.tier1.personalInfo.residence.addresses.header',
            defaultMessage: 'Address',
          })}
        </h2>
        <div className='col-md-6'>
          <SelectSearch
            name='residenceCountry'
            label={residenceCountryLabel}
            value={this.getCountry(values.residenceCountry)}
            options={Countries}
            placeholder={residenceCountryPlaceholder}
            onChange={handleChange}
            showError={!!errors.residenceCountry}
            errorMessage={errors.residenceCountry && intl.formatMessage({
              id: errors.residenceCountry,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.selectSearch}
          />
          <Input
            name='stateOrProvince'
            label={stateLabel}
            value={values.stateOrProvince}
            onChange={handleChange}
            showError={!!errors.stateOrProvince}
            errorMessage={errors.stateOrProvince && intl.formatMessage({
              id: errors.stateOrProvince,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.input}
          />
          <Input
            name='city'
            label={cityLabel}
            value={values.city}
            onChange={handleChange}
            showError={!!errors.city}
            errorMessage={errors.city && intl.formatMessage({
              id: errors.city,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.input}
          />
        </div>
        <div className='col-md-6'>
          <Input
            name='address1'
            label={adress1Label}
            value={values.address1}
            placeholder={adress1Placeholder}
            onChange={handleChange}
            showError={!!errors.address1}
            errorMessage={errors.address1 && intl.formatMessage({
              id: errors.address1,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.input}
          />
          <Input
            name='address2'
            label={adress2Label}
            value={values.address2}
            placeholder={adress2Placeholder}
            onChange={handleChange}
            showError={!!errors.address2}
            errorMessage={errors.address2 && intl.formatMessage({
              id: errors.address2,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.input}
          />
          <Input
            name='zipOrPostalCode'
            label={zipLabel}
            value={values.zipOrPostalCode}
            onChange={handleChange}
            showError={!!errors.zipOrPostalCode}
            errorMessage={errors.zipOrPostalCode && intl.formatMessage({
              id: errors.zipOrPostalCode,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.input}
          />
        </div>

        <AdditionalCitizenship
          name='additionalCitizenship'
          value={values.additionalCitizenship as string[]}
          onChange={handleChange}
        />
      </div>
    );
  }
  getLocalizedData() {
    const { intl } = this.props;

    const residenceCountryLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.residenceCountryLabel',
      defaultMessage: 'Country of residence',
    });
    const residenceCountryPlaceholder = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.residenceCountryPlaceholder',
      defaultMessage: 'Select the country of your Residence',
    });
    const stateLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.stateLabel',
      defaultMessage: 'State/Province',
    });
    const cityLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.cityLabel',
      defaultMessage: 'City',
    });
    const adress1Label = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.adress1Label',
      defaultMessage: 'Address #1',
    });
    const adress1Placeholder = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.adress1Placeholder',
      defaultMessage: 'Street address, P.O. box, company name, c/o',
    });
    const adress2Label = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.adress2Label',
      defaultMessage: 'Address #2 (optional)',
    });
    const adress2Placeholder = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.adress2Placeholder',
      defaultMessage: 'Apt, Suite, Floor, etc.',
    });
    const zipLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.zipLabel',
      defaultMessage: 'Zip/Postal Code',
    });

    return {
      residenceCountryLabel, residenceCountryPlaceholder, stateLabel,
      cityLabel, adress1Label, adress1Placeholder,
      adress2Label, adress2Placeholder, zipLabel,
    };
  }
}

export default injectIntl(Addresses);