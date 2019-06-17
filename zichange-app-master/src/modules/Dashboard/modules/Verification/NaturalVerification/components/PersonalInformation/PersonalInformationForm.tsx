import * as React from 'react';
import { Countries } from '../../../../../../Shared/const/Countries';
import { IOnChangeProps } from '../../../../../../Shared/types/IChangeProps';
import Input from '../../../../../../Shared/components/Inputs/Input';
import { observer } from 'mobx-react';
import { PersonalInformationValues } from '../../stores/parts/PersonalInformationStore';
import { IErrors, IValues } from '../../../../../../Shared/stores/Forms/BaseFormStore';
import InputDate from '../../../../../../Shared/components/Inputs/InputDate';
import SelectSearch from '../../../../../../Shared/components/Inputs/SelectSearch';
import { lazyInject } from '../../../../../../IoC';
import { AccountStore } from '../../../../Profile/stores/AccountStore';
import { FormattedMessage } from 'react-intl';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { LocaleStore } from '../../../../../../Shared/stores/LocaleStore';
import { CounterpartyAccountStore } from '../../../../../../Counterparty/stores/CounterpartyAccountStore';
import { ColorStore } from '../../../../../../Admin/modules/Counterparty/stores/Colors/ColorStore';
import { RGBA } from '../../../../../../Shared/types/IRGBA';

interface IProps {
  handleChange: (changeProps: IOnChangeProps) => void;
  values: IValues<PersonalInformationValues>;
  errors: IErrors<PersonalInformationValues>;
}

@observer
class PersonalInformationForm extends React.Component<IProps & InjectedIntlProps> {
  @lazyInject(AccountStore)
  accountStore: AccountStore;

  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  @lazyInject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  @lazyInject(ColorStore)
  colorStore: ColorStore;

  componentDidMount() {
    this.props.handleChange({ name: 'email', value: this.counterpartyAccountStore.isAgent ?
          this.counterpartyAccountStore.email : this.accountStore.email });
  }

  getCountry = (name) => Countries.find(item => item.value === name);

  render() {
    const { values, errors, handleChange, intl } = this.props;
    
    const { firstNameLabel, middleNameLabel, lastNameLabel,
      emailLabel, birthDateLabel, birthDatePlaceholder,
      birthPlaceLabel, birthPlacePlaceholder, genderLabel,
      genderPlaceholder, genderOption1, genderOption2,
      phoneLabel } = this.getLocalizedData();

    const Sex = [
      {value: 'male', label: genderOption1},
      {value: 'female', label: genderOption2},
    ];

    const getSex = (name) => Sex.find(item => item.value === name);

    return (
      <div className='row tier1__form-section'>
        <p className='header_description col-12 mb-3'
           style={this.colorStore.isLoaded ? {color: RGBA.toRGBAString(this.colorStore.styles.body.color)} : {}}>
          <FormattedMessage id='dashboard.kyc.tier1.personalInfo.recomendation'
                            defaultMessage='Please fill out the form in latin characters'/>
        </p>
        <h2 className='header col-12 mb-4 text--center'>
          <FormattedMessage id='dashboard.kyc.tier1.personalInfo.title' defaultMessage='Personal information'/>
        </h2>
        <div className='col-md-6'>
          <Input 
            name='firstName'
            label={firstNameLabel}
            value={values.firstName}
            onChange={handleChange}
            showError={!!errors.firstName}
            errorMessage={errors.firstName && intl.formatMessage({
              id: errors.firstName,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.input}
          />
          <Input
            name='middleName'
            label={middleNameLabel}
            value={values.middleName}
            onChange={handleChange}
            showError={!!errors.middleName}
            errorMessage={errors.middleName && intl.formatMessage({
              id: errors.middleName,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.input}
          />
          <Input
            name='lastName'
            label={lastNameLabel}
            value={values.lastName}
            onChange={handleChange}
            showError={!!errors.lastName}
            errorMessage={errors.lastName && intl.formatMessage({
              id: errors.lastName,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.input}
          />
          <Input
            name='email'
            type='email'
            label={emailLabel}
            disabled
            value={this.counterpartyAccountStore.isAgent ?
              this.counterpartyAccountStore.email : this.accountStore.email}
            showError={!!errors.email}
            errorMessage={errors.email && intl.formatMessage({
              id: errors.email,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.input}
          />
        </div>
        <div className='col-md-6'>
          <InputDate
            name='birthDate'
            label={birthDateLabel}
            placeholder={birthDatePlaceholder}
            value={values.birthDate && values.birthDate.toString()}
            onChange={handleChange}
            mask='**.**.****'
            maskChar={null}
            showError={!!errors.birthDate}
            errorMessage={errors.birthDate && intl.formatMessage({
              id: errors.birthDate,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.input}
          />
          <SelectSearch
            name='country'
            label={birthPlaceLabel}
            value={this.getCountry(values.country)}
            options={Countries}
            placeholder={birthPlacePlaceholder}
            onChange={handleChange}
            showError={!!errors.country}
            errorMessage={errors.country && intl.formatMessage({
              id: errors.country,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.selectSearch}
          />
          <SelectSearch
            name='gender'
            label={genderLabel}
            value={getSex(values.gender)}
            options={Sex}
            placeholder={genderPlaceholder}
            onChange={handleChange}
            showError={!!errors.gender}
            errorMessage={errors.gender && intl.formatMessage({
              id: errors.gender,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.selectSearch}
          />
          <Input
            name='contactPhone'
            label={phoneLabel}
            value={values.contactPhone}
            onChange={handleChange}
            showError={!!errors.contactPhone}
            errorMessage={errors.contactPhone && intl.formatMessage({
              id: errors.contactPhone,
              defaultMessage: 'Field is required',
            })}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.input}
          />
        </div>
      </div>
    );
  }
  getLocalizedData() {
    const { intl } = this.props;

    const firstNameLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.firstNameLabel',
      defaultMessage: 'First Name',
    });
    const middleNameLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.middleNameLabel',
      defaultMessage: 'Middle Name (optional)',
    });
    const lastNameLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.lastNameLabel',
      defaultMessage: 'Last Name',
    });
    const emailLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.emailLabel',
      defaultMessage: 'Email',
    });
    const birthDateLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.birthDateLabel',
      defaultMessage: 'Date of Birth',
    });
    const birthDatePlaceholder = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.birthDatePlaceholder',
      defaultMessage: 'DD.MM.YYYY',
    });
    const birthPlaceLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.birthPlaceLabel',
      defaultMessage: 'Place of birth',
    });
    const birthPlacePlaceholder = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.birthPlacePlaceholder',
      defaultMessage: 'Select your country',
    });
    const genderLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.genderLabel',
      defaultMessage: 'Gender',
    });
    const genderPlaceholder = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.genderPlaceholder',
      defaultMessage: 'Select your gender',
    });
    const genderOption1 = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.genderOption1',
      defaultMessage: 'Male',
    });
    const genderOption2 = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.genderOption2',
      defaultMessage: 'Female',
    });
    const phoneLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.phoneLabel',
      defaultMessage: 'Contact phone',
    });
    return {
      firstNameLabel, middleNameLabel, lastNameLabel,
      emailLabel, birthDateLabel, birthDatePlaceholder,
      birthPlaceLabel, birthPlacePlaceholder, genderLabel,
      genderPlaceholder, genderOption1, genderOption2,
      phoneLabel,
    };
  }
}

export default injectIntl(PersonalInformationForm);