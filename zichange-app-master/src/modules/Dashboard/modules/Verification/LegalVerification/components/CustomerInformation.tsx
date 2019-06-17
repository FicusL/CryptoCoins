import * as React from 'react';
import Input from '../../../../../Shared/components/Inputs/Input';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { CustomerInformationStore, TotalTurnover } from '../store/parts/CustomerInformationStore';
import InputDate from '../../../../../Shared/components/Inputs/InputDate';
import { Countries } from '../../../../../Shared/const/Countries';
import SelectSearch from '../../../../../Shared/components/Inputs/SelectSearch';
import AdditionalOperationCountries from './AdditionalOperationCountries/AdditionalOperationCountries';
import RadioButton from '../../../../../Shared/components/Inputs/RadioButton/RadioButton';
import TextArea from '../../../../../Shared/components/Inputs/TextArea/TextArea';
import CheckBox from '../../../../../Shared/components/Inputs/Checkbox/Checkbox';

@observer
class CustomerInformation extends React.Component<InjectedIntlProps> {
  @lazyInject(CustomerInformationStore)
  readonly store: CustomerInformationStore;

  // componentWillMount(): void {
  //   this.store.load();
  // }

  handleChange = ({ name, value }) => {
    this.store.change(name, value);
    // window.localStorage.setItem(name, value);
  };

  getCountry = (name) => Countries.find(item => item.value === name);

  render() {
    const { intl } = this.props;
    const { values, errors } = this.store;

    return (
      <>
        <div className='tier1__form-section'>
          <div className='row'>
            <Input
              name='companyName'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.customer.information.company.label',
                  defaultMessage: 'Company full legal name',
              })}
              value={values.companyName}
              errorMessage={errors.companyName && intl.formatMessage({
                id: errors.companyName,
              })}
              showError={!!errors.companyName}
              onChange={this.handleChange}
              className='col-12'
            />
          </div>
          <div className='row'>
            <Input
              name='registrationNumber'
              label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.customer.information.register.number.label',
                defaultMessage: 'Registration number',
              })}
              value={values.registrationNumber}
              errorMessage={errors.registrationNumber && intl.formatMessage({
                id: errors.registrationNumber,
              })}
              showError={!!errors.registrationNumber}
              onChange={this.handleChange}
              className='col-md'
            />
            <InputDate
              name='registrationDate'
              label={intl.formatMessage({
                id: 'dashboard.kyc.legal.customer.information.register.date.label',
                defaultMessage: 'Registration date',
              })}
              placeholder={intl.formatMessage({
                id: 'dashboard.kyc.legal.customer.information.register.date.placeholder',
                defaultMessage: 'DD.MM.YYYY',
              })}
              value={values.registrationDate && values.registrationDate.toString()}
              errorMessage={errors.registrationDate && intl.formatMessage({
                id: errors.registrationDate,
              })}
              showError={!!errors.registrationDate}
              onChange={this.handleChange}
              mask='**.**.****'
              maskChar={null}
              className='col-md'
            />
          </div>
          <div className='row'>
            <SelectSearch
              name='countryOfRegistration'
              label={intl.formatMessage({
                id: 'dashboard.kyc.legal.customer.information.countryOfRegistration.label',
                defaultMessage: 'Country of registration',
              })}
              options={Countries}
              placeholder={intl.formatMessage({
                id: 'dashboard.kyc.legal.activity.operation.search.placeholder',
                defaultMessage: 'Select the operation country',
              })}
              value={this.getCountry(values.countryOfRegistration)}
              errorMessage={errors.countryOfRegistration && intl.formatMessage({
                id: errors.countryOfRegistration,
              })}
              showError={!!errors.countryOfRegistration}
              onChange={this.handleChange}
              className='col-md'
            />
            <Input
              name='contactPhone'
              label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.customer.information.contact.phone.label',
                defaultMessage: 'Contact phone',
              })}
              value={values.contactPhone}
              errorMessage={errors.contactPhone && intl.formatMessage({
                id: errors.contactPhone,
              })}
              showError={!!errors.contactPhone}
              onChange={this.handleChange}
              className='col-md'
            />
          </div>
          <div className='row'>
            <Input
              name='legalAddress'
              label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.customer.information.legal.address.label',
                defaultMessage: 'Legal address (street, building-room, zip code, city, country)',
              })}
              value={values.legalAddress}
              errorMessage={errors.legalAddress && intl.formatMessage({
                id: errors.legalAddress,
              })}
              showError={!!errors.legalAddress}
              onChange={this.handleChange}
              className='col-md'
            />
            <Input
              name='correspondenceAddress'
              label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.customer.information.correspondence.address.label',
                defaultMessage: 'Correspondence address (street, building-room, zip code, city, country)',
              })}
              value={values.correspondenceAddress}
              errorMessage={errors.correspondenceAddress && intl.formatMessage({
                id: errors.correspondenceAddress,
              })}
              showError={!!errors.correspondenceAddress}
              onChange={this.handleChange}
              className='col-md'
            />
          </div>
          <div className='row align-items-end'>
            <Input
              name='companyEmail'
              label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.customer.information.contact.email.label',
                defaultMessage: 'Corporate e-mail',
              })}
              value={values.companyEmail}
              errorMessage={errors.companyEmail && intl.formatMessage({
                id: errors.companyEmail,
              })}
              showError={!!errors.companyEmail}
              onChange={this.handleChange}
              className='col-md'
            />
            <Input
              name='webPage'
              label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.customer.information.website.label',
                defaultMessage: 'Website',
              })}
              value={values.webPage}
              errorMessage={errors.webPage && intl.formatMessage({
                id: errors.webPage,
              })}
              showError={!!errors.webPage}
              onChange={this.handleChange}
              className='col-md'
            />
          </div>
        </div>
        <div className='company-activity container-responsive__kyc'>
          <div className='row tier1__form-section'>
            <h2 className='header col-12 mb-4 text--center'>
              { intl.formatMessage({
                id: 'dashboard.kyc.legal.structure.form.header',
                defaultMessage: 'Company structure',
              })}
            </h2>
            <div className='col-12'>
              <label className='form__label'>
                { intl.formatMessage({
                  id: 'dashboard.kyc.legal.structure.form.label',
                  defaultMessage: 'Is your company a subsidiary or has subsidiaries?',
                })}
              </label>

              <div className='d-flex mb-3'>
                <RadioButton
                  name='subsidiaryCompany'
                  label={ intl.formatMessage({
                    id: 'dashboard.kyc.legal.structure.form.radio.yes.label',
                    defaultMessage: 'Yes',
                  })}
                  value='yes'
                  checked={values.subsidiaryCompany === 'yes'}
                  showError={!!errors.subsidiaryCompany}
                  onChange={this.handleChange}
                />
                <RadioButton
                  name='subsidiaryCompany'
                  label={ intl.formatMessage({
                    id: 'dashboard.kyc.legal.structure.form.radio.no.label',
                    defaultMessage: 'No',
                  })}
                  value='no'
                  checked={values.subsidiaryCompany === 'no'}
                  showError={!!errors.subsidiaryCompany}
                  onChange={this.handleChange}
                />
              </div>
            </div>

            {values.subsidiaryCompany === 'yes' &&
            <div className='col-12'>
              <TextArea
                name='companyStructure'
                label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.structure.form.text.input.label',
                  defaultMessage: 'Please describe the structure',
                })}
                value={values.companyStructure}
                errorMessage={errors.companyStructure && intl.formatMessage({
                  id: errors.companyStructure,
                })}
                showError={!!errors.companyStructure}
                onChange={this.handleChange}
              />
            </div>}
          </div>

          <div className='row tier1__form-section'>
            <h2 className='header col-12 mb-4 text--center'>
              {intl.formatMessage({
                id: 'dashboard.kyc.legal.activity.header',
                defaultMessage: 'Company activity',
              })}
            </h2>
            <div className='col-12 col-md-6'>
              <Input
                name='companyActivity'
                label={intl.formatMessage({
                  id: 'dashboard.kyc.legal.activity.company.input.label',
                  defaultMessage: 'The main activity of the company',
                })}
                value={values.companyActivity}
                errorMessage={errors.companyActivity && intl.formatMessage({
                  id: errors.companyActivity,
                })}
                showError={!!errors.companyActivity}
                onChange={this.handleChange}
              />
            </div>
            <div className='col-12 col-md-6'>
              <SelectSearch
                name='operationCountry'
                label={intl.formatMessage({
                  id: 'dashboard.kyc.legal.activity.operation.search.label',
                  defaultMessage: 'Main country of operation',
                })}
                options={Countries}
                placeholder={intl.formatMessage({
                  id: 'dashboard.kyc.legal.activity.operation.search.placeholder',
                  defaultMessage: 'Select the operation country',
                })}
                value={this.getCountry(values.operationCountry)}
                errorMessage={errors.operationCountry && intl.formatMessage({
                  id: errors.operationCountry,
                })}
                showError={!!errors.operationCountry}
                onChange={this.handleChange}
              />

              <AdditionalOperationCountries
                name='additionalOperationCountries'
                onChange={this.handleChange}
                value={values.additionalOperationCountries as string[]}
              />
            </div>

            <div className='col-12 tier1__form-section'>
              <label className='form__label'>
                {intl.formatMessage({
                  id: 'dashboard.kyc.legal.activity.form.label',
                  defaultMessage: 'The activity is licensed or registered:',
                })}
              </label>
              <div className='d-flex mb-3'>
                <RadioButton
                  name='registeredOrLicensedActivity'
                  label={intl.formatMessage({
                    id: 'dashboard.kyc.legal.activity.form.radio.yes.label',
                    defaultMessage: 'Yes',
                  })}
                  value='yes'
                  checked={values.registeredOrLicensedActivity === 'yes'}
                  showError={!!errors.registeredOrLicensedActivity}
                  onChange={this.handleChange}
                />
                <RadioButton
                  name='registeredOrLicensedActivity'
                  label={ intl.formatMessage({
                    id: 'dashboard.kyc.legal.activity.form.radio.no.label',
                    defaultMessage: 'No',
                  })}
                  value='no'
                  checked={values.registeredOrLicensedActivity === 'no'}
                  showError={!!errors.registeredOrLicensedActivity}
                  onChange={this.handleChange}
                />
              </div>
              {values.registeredOrLicensedActivity === 'yes' &&
                <div className='col-12'>
                  <Input
                    name='licenseOrRegistrationNumber'
                    label={ intl.formatMessage({
                      id: 'dashboard.kyc.legal.activity.form.number.input.label',
                      defaultMessage: 'License or registration number',
                    })}
                    value={values.licenseOrRegistrationNumber}
                    errorMessage={errors.licenseOrRegistrationNumber && intl.formatMessage({
                      id: errors.licenseOrRegistrationNumber,
                    })}
                    showError={!!errors.licenseOrRegistrationNumber}
                    onChange={this.handleChange}
                  />
                </div>}
            </div>

            <div className='col-12'>
              <h2 className='header col-12 mb-4 text--center'>
                {intl.formatMessage({
                  id: 'dashboard.kyc.legal.customer.information.purposeBusinessRelationship.label',
                  defaultMessage: 'Purpose of the business relationship',
                })}
              </h2>
              <label className='form__label'>
                {intl.formatMessage({
                  id: 'dashboard.kyc.legal.customer.information.totalTurnover.label',
                  defaultMessage: 'What is the legal entity’s total turnover per year (EUR)?',
                })}
              </label>
              <div className='row m-0'>
                <RadioButton
                  classNames='mb-2 col-md-4 col-4'
                  name='totalTurnover'
                  label='< 100.000'
                  value={TotalTurnover.Less100}
                  checked={values.totalTurnover === TotalTurnover.Less100}
                  showError={!!errors.totalTurnover}
                  onChange={this.handleChange}
                />
                <RadioButton
                  classNames='mb-2 col-md-4 col-4'
                  name='totalTurnover'
                  label='100.000 - 500.000'
                  value={TotalTurnover.Between100_500}
                  checked={values.totalTurnover === TotalTurnover.Between100_500}
                  showError={!!errors.totalTurnover}
                  onChange={this.handleChange}
                />
                <RadioButton
                  classNames='mb-2 col-md-4 col-4'
                  name='totalTurnover'
                  label='500.000 - 1.000.000'
                  value={TotalTurnover.Between500_1k}
                  checked={values.totalTurnover === TotalTurnover.Between500_1k}
                  showError={!!errors.totalTurnover}
                  onChange={this.handleChange}
                />
                <RadioButton
                  classNames='mb-2 col-md-4 col-4'
                  name='totalTurnover'
                  label='1.000.000 - 2.000.000'
                  value={TotalTurnover.Between1k_2k}
                  checked={values.totalTurnover === TotalTurnover.Between1k_2k}
                  showError={!!errors.totalTurnover}
                  onChange={this.handleChange}
                />
                <RadioButton
                  classNames='mb-2 col-md-4 col-4'
                  name='totalTurnover'
                  label='2.000.000 - 10.000.000'
                  value={TotalTurnover.Between2k_10k}
                  checked={values.totalTurnover === TotalTurnover.Between2k_10k}
                  showError={!!errors.totalTurnover}
                  onChange={this.handleChange}
                />
                <RadioButton
                  classNames='mb-2 col-md-4 col-4'
                  name='totalTurnover'
                  label='10.000.000 - 50.000.000'
                  value={TotalTurnover.Between10k_50k}
                  checked={values.totalTurnover === TotalTurnover.Between10k_50k}
                  showError={!!errors.totalTurnover}
                  onChange={this.handleChange}
                />
                <RadioButton
                  classNames='mb-5 col-md-4 col-4'
                  name='totalTurnover'
                  label='> 50.000.000'
                  value={TotalTurnover.More50k}
                  checked={values.totalTurnover === TotalTurnover.More50k}
                  showError={!!errors.totalTurnover}
                  onChange={this.handleChange}
                />
              </div>

            </div>
            <div className='col-12'>
              <label className='form__label'>
                {intl.formatMessage({
                  id: 'dashboard.kyc.legal.customer.information.useBagukFinance.label',
                  defaultMessage: 'What is the purpose of the use of Baguk Finance OÜ’s services?',
                })}
              </label>
              <CheckBox
                className='mb-2'
                name='fiatToCryptoExchange'
                label={
                  intl.formatMessage({
                    id: 'dashboard.kyc.legal.customer.information.useBagukFinance.checkbox.fiatToCryptocurrencyExchange',
                    defaultMessage: 'Fiat to cryptocurrency exchange',
                  })}
                checked={values.fiatToCryptoExchange}
                onChange={this.handleChange}
                showError={!!errors.fiatToCryptoExchange}
              />
              <CheckBox
                className='mb-2'
                name='cryptoToFiatExchange'
                label={
                  intl.formatMessage({
                    id: 'dashboard.kyc.legal.customer.information.useBagukFinance.checkbox.cryptocurrencyToFiatExchange',
                    defaultMessage: 'Cryptocurrency to fiat exchange',
                  })}
                checked={values.cryptoToFiatExchange}
                onChange={this.handleChange}
                showError={!!errors.cryptoToFiatExchange}
              />
              <CheckBox
                className='mb-2'
                name='cryptoToCryptoExchange'
                label={
                  intl.formatMessage({
                    id: 'dashboard.kyc.legal.customer.information.useBagukFinance.checkbox.cryptoTocryptoExchange',
                    defaultMessage: 'Cryptocurrency to cryptocurrency exchange',
                  })
                }
                checked={values.cryptoToCryptoExchange}
                onChange={this.handleChange}
                showError={!!errors.cryptoToCryptoExchange}
              />
              <CheckBox
                className='mb-2'
                name='other'
                label={
                  intl.formatMessage({
                    id: 'dashboard.kyc.legal.customer.information.useBagukFinance.checkbox.other',
                    defaultMessage: 'Other',
                  })}
                checked={values.other}
                onChange={this.handleChange}
                showError={!!errors.other}
              />
              {values.other === true &&
                <div className='col-12'>
                  <Input
                    name='otherDetails'
                    value={values.otherDetails}
                    errorMessage={errors.otherDetails && intl.formatMessage({
                      id: errors.otherDetails,
                    })}
                    showError={!!errors.otherDetails}
                    onChange={this.handleChange}
                  />
                </div>}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default injectIntl(CustomerInformation);
