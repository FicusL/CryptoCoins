import * as React from 'react';
import RadioButton from '../../../../../Shared/components/Inputs/RadioButton/RadioButton';
import Input from '../../../../../Shared/components/Inputs/Input';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { BeneficiariesAndRepresentativesStore } from '../stores/parts/BeneficiariesAndRepresentativesStore';
import { Countries } from '../../../../../Shared/const/Countries';
import InputDate from '../../../../../Shared/components/Inputs/InputDate';
import SelectSearch from '../../../../../Shared/components/Inputs/SelectSearch';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { LocaleStore } from '../../../../../Shared/stores/LocaleStore';
import { ColorStore } from '../../../../../Admin/modules/Counterparty/stores/Colors/ColorStore';
import { CounterpartyAccountStore } from '../../../../../Counterparty/stores/CounterpartyAccountStore';

@observer
class BeneficiariesAndRepresentatives extends React.Component<InjectedIntlProps> {
  @lazyInject(BeneficiariesAndRepresentativesStore)
  readonly store : BeneficiariesAndRepresentativesStore;

  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  @lazyInject(ColorStore)
  color: ColorStore;

  @lazyInject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  componentWillMount(): void {
    this.store.loadLocalStorage();
  }

  handleChange = ({ name, value }) => {
    this.store.change(name, value);
    window.localStorage.setItem(name, value);
  };

  getCountry = (name) => Countries.find(item => item.value === name);

  render() {
    const { representedByThirdParty, ultimateBeneficiary, PEP } = this.store.values;
    const { intl } = this.props;

    const { politicallyExposedCloseLabel, politicallyExposedFamilyLabel, politicallyExposedLabel,
            contactLabel, positionLabel, fullNameLabel, politicallyTitle, residenceCountryLabel,
            personalCodeLabel, termPowerAttorneyLabel, fieldPowerAttorneyLabel, basisPowerAttorneyLabel,
            residenceCountryPlaceholder, birthPlacePlaceholder, birthPlaceLabel, birthDatePlaceholder,
            birthDateLabel, lastNameLabel, firstNameLabel, noLabel, yesLabel, representTitle,
          } = this.getLocalizedData();
          
    return (
      <div className='tier1 benefic'>
        <div className='row tier1__form-section'>
          <h2 className='header col-12 mb-5 ml-12'>
            {representTitle}
          </h2>
          <div className='col-md-12 d-flex flex-md-row'>
            <RadioButton
              name='representedByThirdParty'
              value='yes'
              label={yesLabel}
              checked={representedByThirdParty === 'yes'}
              onChange={this.handleChange}
              showError={!!this.store.errors.representedByThirdParty}
              classNames='mb-4'
              colors={this.counterpartyAccountStore.isAgent && this.color.styles.radioButton}
            />
            <RadioButton
              name='representedByThirdParty'
              value='no'
              label={noLabel}
              checked={representedByThirdParty === 'no'}
              onChange={this.handleChange}
              showError={!!this.store.errors.representedByThirdParty}
              classNames='mb-4'
              colors={this.counterpartyAccountStore.isAgent && this.color.styles.radioButton}
            />
          </div>
          {representedByThirdParty === 'yes' ?
            <div className='col-md-6'>
              <Input
                name='beneficFirstName3Party'
                label={firstNameLabel}
                value={this.store.values.beneficFirstName3Party}
                onChange={this.handleChange}
                showError={!!this.store.errors.beneficFirstName3Party}
                errorMessage={this.store.errors.beneficFirstName3Party && intl.formatMessage({
                  id: this.store.errors.beneficFirstName3Party,
                  defaultMessage: 'Field is required',
                })}
                colors={this.counterpartyAccountStore.isAgent && this.color.styles.input}
              />
              <Input
                name='beneficLastName3Party'
                label={lastNameLabel}
                value={this.store.values.beneficLastName3Party}
                onChange={this.handleChange}
                showError={!!this.store.errors.beneficLastName3Party}
                errorMessage={this.store.errors.beneficLastName3Party && intl.formatMessage({
                  id: this.store.errors.beneficLastName3Party,
                  defaultMessage: 'Field is required',
                })}
                colors={this.counterpartyAccountStore.isAgent && this.color.styles.input}
              />
              <InputDate
                name='beneficBirthDate3Party'
                label={birthDateLabel}
                placeholder={birthDatePlaceholder}
                value={this.store.values.beneficBirthDate3Party && this.store.values.beneficBirthDate3Party.toString()}
                onChange={this.handleChange}
                mask='**.**.****'
                maskChar={null}
                showError={!!this.store.errors.beneficBirthDate3Party}
                errorMessage={this.store.errors.beneficBirthDate3Party && intl.formatMessage({
                  id: this.store.errors.beneficBirthDate3Party,
                  defaultMessage: 'Field is required',
                })}
                colors={this.counterpartyAccountStore.isAgent && this.color.styles.input}
              />
            </div>
          : null}
          {representedByThirdParty === 'yes' ?
            <div className='col-md-6'>
              <Input
                name='basisPowerAttorney'
                label={basisPowerAttorneyLabel}
                value={this.store.values.basisPowerAttorney}
                onChange={this.handleChange}
                showError={!!this.store.errors.basisPowerAttorney}
                errorMessage={this.store.errors.basisPowerAttorney && intl.formatMessage({
                  id: this.store.errors.basisPowerAttorney,
                  defaultMessage: 'Field is required',
                })}
                colors={this.counterpartyAccountStore.isAgent && this.color.styles.input}
              />
              <Input
                name='fieldPowerAttorney'
                label={fieldPowerAttorneyLabel}
                value={this.store.values.fieldPowerAttorney}
                onChange={this.handleChange}
                showError={!!this.store.errors.fieldPowerAttorney}
                errorMessage={this.store.errors.fieldPowerAttorney && intl.formatMessage({
                  id: this.store.errors.fieldPowerAttorney,
                  defaultMessage: 'Field is required',
                })}
                colors={this.counterpartyAccountStore.isAgent && this.color.styles.input}
              />
              <Input
                name='termPowerAttorney'
                label={termPowerAttorneyLabel}
                value={this.store.values.termPowerAttorney}
                onChange={this.handleChange}
                showError={!!this.store.errors.termPowerAttorney}
                errorMessage={this.store.errors.termPowerAttorney && intl.formatMessage({
                  id: this.store.errors.termPowerAttorney,
                  defaultMessage: 'Field is required',
                })}
                colors={this.counterpartyAccountStore.isAgent && this.color.styles.input}
              />
            </div>
          : null}
        </div>

        <div className='row tier1__form-section'>
          <h2 className='header col-12 ml-12 mb-5'>
            {intl.formatMessage({
              id: 'dashboard.kyc.tier1.personalInfo.ultimate.beneficiary',
              defaultMessage: 'I am the ultimate beneficiary',
            })}
          </h2>
          <div className='col-md-12 d-flex flex-md-row'>
            <RadioButton
              name='ultimateBeneficiary'
              value='yes'
              label={yesLabel}
              checked={ultimateBeneficiary === 'yes'}
              onChange={this.handleChange}
              showError={!!this.store.errors.ultimateBeneficiary}
              classNames='mb-4'
              colors={this.counterpartyAccountStore.isAgent && this.color.styles.radioButton}
            />
            <RadioButton
              name='ultimateBeneficiary'
              value='no'
              label={noLabel}
              checked={ultimateBeneficiary === 'no'}
              onChange={this.handleChange}
              showError={!!this.store.errors.ultimateBeneficiary}
              classNames='mb-4'
              colors={this.counterpartyAccountStore.isAgent && this.color.styles.radioButton}
            />
          </div>
          {ultimateBeneficiary === 'no' ?

            <div className='container p-0'>
              <div className='row'>
                <Input
                  name='beneficFirstNameUltBeneficiary'
                  label={firstNameLabel}
                  value={this.store.values.beneficFirstNameUltBeneficiary}
                  onChange={this.handleChange}
                  showError={!!this.store.errors.beneficFirstNameUltBeneficiary}
                  errorMessage={this.store.errors.beneficFirstNameUltBeneficiary && intl.formatMessage({
                    id: this.store.errors.beneficFirstNameUltBeneficiary,
                    defaultMessage: 'Field is required',
                  })}
                  className='col-md-6'
                  colors={this.counterpartyAccountStore.isAgent && this.color.styles.input}
                />
                <InputDate
                  name='beneficBirthDateUltBeneficiary'
                  label={birthDateLabel}
                  placeholder={birthDatePlaceholder}
                  value={
                    this.store.values.beneficBirthDateUltBeneficiary
                    &&
                    this.store.values.beneficBirthDateUltBeneficiary.toString()
                  }
                  onChange={this.handleChange}
                  mask='**.**.****'
                  maskChar={null}
                  showError={!!this.store.errors.beneficBirthDateUltBeneficiary}
                  errorMessage={this.store.errors.beneficBirthDateUltBeneficiary && intl.formatMessage({
                    id: this.store.errors.beneficBirthDateUltBeneficiary,
                    defaultMessage: 'Field is required',
                  })}
                  className='col-md-6'
                  colors={this.counterpartyAccountStore.isAgent && this.color.styles.input}
                />
              </div>
              <div className='row'>
                <Input
                  name='beneficLastNameUltBeneficiary'
                  label={lastNameLabel}
                  value={this.store.values.beneficLastNameUltBeneficiary}
                  onChange={this.handleChange}
                  showError={!!this.store.errors.beneficLastNameUltBeneficiary}
                  errorMessage={this.store.errors.beneficLastNameUltBeneficiary && intl.formatMessage({
                    id: this.store.errors.beneficLastNameUltBeneficiary,
                    defaultMessage: 'Field is required',
                  })}
                  className='col-md-6'
                  colors={this.counterpartyAccountStore.isAgent && this.color.styles.input}
                />
                <SelectSearch
                  name='beneficBirthPlace'
                  label={birthPlaceLabel}
                  value={this.getCountry(this.store.values.beneficBirthPlace)}
                  options={Countries}
                  placeholder={birthPlacePlaceholder}
                  onChange={this.handleChange}
                  showError={!!this.store.errors.beneficBirthPlace}
                  errorMessage={this.store.errors.beneficBirthPlace && intl.formatMessage({
                    id: this.store.errors.beneficBirthPlace,
                    defaultMessage: 'Field is required',
                  })}
                  className='col-md-6'
                  colors={this.counterpartyAccountStore.isAgent && this.color.styles.selectSearch}
                />
              </div>
              <div className='row align-items-md-end'>
                <Input
                  name='personalCode'
                  label={personalCodeLabel}
                  value={this.store.values.personalCode}
                  onChange={this.handleChange}
                  showError={!!this.store.errors.personalCode}
                  errorMessage={this.store.errors.personalCode && intl.formatMessage({
                    id: this.store.errors.personalCode,
                    defaultMessage: 'Field is required',
                  })}
                  className='col-md-6'
                  colors={this.counterpartyAccountStore.isAgent && this.color.styles.input}
                />
                <SelectSearch
                  name='beneficResidenceCountry'
                  label={residenceCountryLabel}
                  value={this.getCountry(this.store.values.beneficResidenceCountry)}
                  options={Countries}
                  placeholder={residenceCountryPlaceholder}
                  onChange={this.handleChange}
                  showError={!!this.store.errors.beneficResidenceCountry}
                  errorMessage={this.store.errors.beneficResidenceCountry && intl.formatMessage({
                    id: this.store.errors.beneficResidenceCountry,
                    defaultMessage: 'Field is required',
                  })}
                  className='col-md-6'
                  colors={this.counterpartyAccountStore.isAgent && this.color.styles.selectSearch}
                />
              </div>
            </div>
            : null}
        </div>

        <div className='row tier1__form-section'>
          <h2 className='header col-12 ml-12 mb-5'>
            {politicallyTitle}
          </h2>
          <div className='col-md-12 d-flex flex-md-row'>
            <RadioButton
              name='PEP'
              value='yes'
              label={yesLabel}
              checked={PEP === 'yes'}
              onChange={this.handleChange}
              showError={!!this.store.errors.PEP}
              classNames='mb-4'
              colors={this.counterpartyAccountStore.isAgent && this.color.styles.radioButton}
            />
            <RadioButton
              name='PEP'
              value='no'
              label={noLabel}
              checked={PEP === 'no'}
              onChange={this.handleChange}
              showError={!!this.store.errors.PEP}
              classNames='mb-4'
              colors={this.counterpartyAccountStore.isAgent && this.color.styles.radioButton}
            />
          </div>
          {PEP === 'yes' ?
            <div className='col-md-6'>
              <Input
                name='officialFullName'
                label={fullNameLabel}
                value={this.store.values.officialFullName}
                onChange={this.handleChange}
                showError={!!this.store.errors.officialFullName}
                errorMessage={this.store.errors.officialFullName && intl.formatMessage({
                  id: this.store.errors.officialFullName,
                  defaultMessage: 'Field is required',
                })}
                colors={this.counterpartyAccountStore.isAgent && this.color.styles.input}
              />
            </div>
            : null}
          {PEP === 'yes' ?
            <div className='col-md-6'>
              <Input
                name='officialPosition'
                label={positionLabel}
                value={this.store.values.officialPosition}
                onChange={this.handleChange}
                showError={!!this.store.errors.officialPosition}
                errorMessage={this.store.errors.officialPosition && intl.formatMessage({
                  id: this.store.errors.officialPosition,
                  defaultMessage: 'Field is required',
                })}
                colors={this.counterpartyAccountStore.isAgent && this.color.styles.input}
              />
            </div>
            : null}
          {PEP === 'yes' ?
            <div className='col-12'>
              <label className='form__label'>{contactLabel}</label>
              <RadioButton
                classNames='mb-4'
                name='politicallyExposedRelation'
                label={politicallyExposedLabel}
                value='self'
                checked={this.store.values.politicallyExposedRelation === 'self'}
                showError={!!this.store.errors.PEP}
                onChange={this.handleChange}
                colors={this.counterpartyAccountStore.isAgent && this.color.styles.radioButton}
              />
              <RadioButton
                classNames='mb-4'
                name='politicallyExposedRelation'
                label={politicallyExposedFamilyLabel}
                value='family'
                checked={this.store.values.politicallyExposedRelation === 'family'}
                showError={!!this.store.errors.PEP}
                onChange={this.handleChange}
                colors={this.counterpartyAccountStore.isAgent && this.color.styles.radioButton}
              />
              <RadioButton
                name='politicallyExposedRelation'
                label={politicallyExposedCloseLabel}
                value='closeAssociate'
                checked={this.store.values.politicallyExposedRelation === 'closeAssociate'}
                showError={!!this.store.errors.PEP}
                onChange={this.handleChange}
                colors={this.counterpartyAccountStore.isAgent && this.color.styles.radioButton}
              />
            </div>
          : null}
        </div>
      </div>
    );
  }
  getLocalizedData() {
    const { intl } = this.props;
    const representTitle = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.representTitle',
      defaultMessage: 'I am represented by third party',
    });
    const yesLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.yesLabel',
      defaultMessage: 'Yes',
    });
    const noLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.noLabel',
      defaultMessage: 'No',
    });
    const firstNameLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.firstNameLabel',
      defaultMessage: 'First Name',
    });
    const lastNameLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.lastNameLabel',
      defaultMessage: 'Last Name',
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
    const residenceCountryPlaceholder = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.residenceCountryPlaceholder',
      defaultMessage: 'Select the country of your Residence',
    });
    const basisPowerAttorneyLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.basisPowerAttorneyLabel',
      defaultMessage: 'Basis for the Power of Attorney',
    });
    const fieldPowerAttorneyLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.fieldPowerAttorneyLabel',
      defaultMessage: 'Field of the Power of Attorney',
    });
    const termPowerAttorneyLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.termPowerAttorneyLabel',
      defaultMessage: 'Term of the Power of Attorney',
    });
    const personalCodeLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.personalCodeLabel',
      defaultMessage: 'Personal Code (if any)',
    });
    const residenceCountryLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.personalInfo.residenceCountryLabel',
      defaultMessage: 'Country of residence',
    });
    const politicallyTitle = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.politicallyTitle',
      defaultMessage: 'I or my representative or my family member or a close associate are ' +
        'politically exposed persons (PEP)',
    });
    const fullNameLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.fullNameLabel',
      defaultMessage: 'Full name of the official',
    });
    const positionLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.positionLabel',
      defaultMessage: 'Position',
    });
    const contactLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.contactLabel',
      defaultMessage: 'Contact with the client:',
    });
    const politicallyExposedLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.politicallyExposedLabel',
      defaultMessage: 'I am a politically exposed person',
    });
    const politicallyExposedFamilyLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.politicallyExposedFamilyLabel',
      defaultMessage: 'Family member of a politically exposed person',
    });
    const politicallyExposedCloseLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.politicallyExposedCloseLabel',
      defaultMessage: 'Person known to be a close associate of a politically exposed person',
    });

    return {
      politicallyExposedCloseLabel, politicallyExposedFamilyLabel, politicallyExposedLabel,
      contactLabel, positionLabel, fullNameLabel, politicallyTitle, residenceCountryLabel,
      personalCodeLabel, termPowerAttorneyLabel, fieldPowerAttorneyLabel, basisPowerAttorneyLabel,
      residenceCountryPlaceholder, birthPlacePlaceholder, birthPlaceLabel, birthDatePlaceholder,
      birthDateLabel, lastNameLabel, firstNameLabel, noLabel, yesLabel, representTitle,
    };
  }
}

export default injectIntl(BeneficiariesAndRepresentatives);