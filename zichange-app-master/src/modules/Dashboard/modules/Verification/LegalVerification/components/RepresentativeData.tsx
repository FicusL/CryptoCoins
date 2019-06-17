import * as React from 'react';
import Input from '../../../../../Shared/components/Inputs/Input';
import InputDate from '../../../../../Shared/components/Inputs/InputDate';
import { Countries } from '../../../../../Shared/const/Countries';
import SelectSearch from '../../../../../Shared/components/Inputs/SelectSearch';
import RadioButton from '../../../../../Shared/components/Inputs/RadioButton/RadioButton';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { RepresentativeDataStore } from '../store/parts/RepresentativeDataStore';
import TextFormat from '../../../../../Shared/components/TextFormats/TextFormat';
import { observable } from 'mobx';

@observer
class RepresentativeData extends React.Component<InjectedIntlProps> {
  @lazyInject(RepresentativeDataStore)
  readonly store: RepresentativeDataStore;

  // componentWillMount(): void {
  //   this.store.loadLocalStorage();
  // }

  @observable readonly IdTypes = [
    {value: this.props.intl.formatMessage({
        id: 'dashboard.kyc.legal.representative.id.type.passport.value',
        defaultMessage: 'International Passport',
      }),
    label: this.props.intl.formatMessage({
        id: 'dashboard.kyc.legal.representative.id.type.passport.label',
        defaultMessage: 'International Passport',
      })},
    {value: this.props.intl.formatMessage({
        id: 'dashboard.kyc.legal.representative.id.type.license.value',
        defaultMessage: 'Driver License',
      }), label: this.props.intl.formatMessage({
        id: 'dashboard.kyc.legal.representative.id.type.license.label',
        defaultMessage: 'Driver License',
      })},
    {value: this.props.intl.formatMessage({
        id: 'dashboard.kyc.legal.representative.id.type.card.value',
        defaultMessage: 'ID Card',
      }), label: this.props.intl.formatMessage({
        id: 'dashboard.kyc.legal.representative.id.type.card.label',
        defaultMessage: 'ID Card',
      })},
    {value: this.props.intl.formatMessage({
        id: 'dashboard.kyc.legal.representative.id.type.other.value',
        defaultMessage: 'Other',
      }), label: this.props.intl.formatMessage({
        id: 'dashboard.kyc.legal.representative.id.type.other.label',
        defaultMessage: 'Other',
      })},
  ];

  handleChange = ({ name, value }) => {
    this.store.change(name, value);
    window.localStorage.setItem(name, value);
  };

  getCountry = (name) => Countries.find(item => item.value === name);
  getIdType = (name) => this.IdTypes.find(item => item.value === name);

  render() {
    const { intl } = this.props;
    const { values, errors } = this.store;

    console.log('~rerender[RepresentativeData]~');
    console.log('intl: ', intl);

    return (
      <div className='container-responsive__kyc'>
        <div className='row tier1__form-section'>
          <div className='col-md-6'>
            <Input
              name='firstName'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.first.name.label',
                  defaultMessage: 'First name',
              })}
              value={values.firstName}
              errorMessage={errors.firstName && intl.formatMessage({
                id: errors.firstName,
              })}
              showError={!!errors.firstName}
              onChange={this.handleChange}
            />
            <Input
              name='lastName'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.last.name.label',
                  defaultMessage: 'Last name',
              })}
              value={values.lastName}
              errorMessage={errors.lastName && intl.formatMessage({
                id: errors.lastName,
              })}
              showError={!!errors.lastName}
              onChange={this.handleChange}
            />
            <Input
              name='personalCode'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.personal.code.label',
                  defaultMessage: 'Personal code (if any)',
              })}
              value={values.personalCode}
              errorMessage={errors.personalCode && intl.formatMessage({
                id: errors.personalCode,
              })}
              showError={!!errors.personalCode}
              onChange={this.handleChange}
            />
          </div>

          <div className='col-md-6'>
            <InputDate
              name='dateOfBirth'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.date.birth.label',
                  defaultMessage: 'Date of birth',
              })}
              placeholder={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.date.birth.placeholder',
                  defaultMessage: 'DD.MM.YYYY',
              })}
              value={values.dateOfBirth && values.dateOfBirth.toString()}
              errorMessage={errors.dateOfBirth && intl.formatMessage({
                id: errors.dateOfBirth,
              })}
              showError={!!errors.dateOfBirth}
              onChange={this.handleChange}
              mask='**.**.****'
              maskChar={null}
            />
            <SelectSearch
              name='country'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.place.birth.label',
                  defaultMessage: 'Place of birth',
              })}
              options={Countries}
              placeholder={intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.place.birth.placeholder',
                  defaultMessage: 'Select your country',
              })}
              value={this.getCountry(values.country)}
              errorMessage={errors.country && intl.formatMessage({
                id: errors.country,
              })}
              showError={!!errors.country}
              onChange={this.handleChange}
            />
            <SelectSearch
              name='countryOfResidence'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.residence.country.label',
                  defaultMessage: 'Country of residence',
              })}
              options={Countries}
              value={this.getCountry(values.countryOfResidence)}
              errorMessage={errors.countryOfResidence && intl.formatMessage({
                id: errors.countryOfResidence,
              })}
              showError={!!errors.countryOfResidence}
              onChange={this.handleChange}
            />
          </div>

          <div className='col-12'>
            <Input
              name='addressOfResidence'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.residence.address.label',
                  defaultMessage: 'Address of residence (street, building-apartment, zip code, city, country)',
              })}
              value={values.addressOfResidence}
              errorMessage={errors.addressOfResidence && intl.formatMessage({
                id: errors.addressOfResidence,
              })}
              showError={!!errors.addressOfResidence}
              onChange={this.handleChange}
            />
          </div>
        </div>

        <div className='row tier1__form-section'>
          <h2 className='header col-12 mb-4 text--center'>
            {intl.formatMessage({
                id: 'dashboard.kyc.legal.representative.identification.h2',
                defaultMessage: 'Identification',
            })}
          </h2>
          <div className='col-12'>
            <p className='header_description mb-3 ml-2'>
              <TextFormat id='dashboard.kyc.legal.representative.identification.header' />
            </p>
          </div>
          <div className='col-md-6'>
            <SelectSearch
              name='idType'
              label={intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.id.type.label',
                  defaultMessage: 'Type of ID',
              })}
              value={this.getIdType(values.idType)}
              options={this.IdTypes}
              placeholder={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.id.type.placeholder',
                  defaultMessage: 'Select the ID type',
              })}
              onChange={this.handleChange}
              showError={!!errors.idType}
              errorMessage={errors.idType && intl.formatMessage({
                id: errors.idType,
              })}
            />
            <Input
              name='idNumber'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.id.number.label',
                  defaultMessage: 'ID number',
              })}
              value={values.idNumber}
              errorMessage={errors.idNumber && intl.formatMessage({
                id: errors.idNumber,
              })}
              showError={!!errors.idNumber}
              onChange={this.handleChange}
            />
            <SelectSearch
              name='issuingCountry'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.issuing.country.label',
                  defaultMessage: 'The issuing country',
              })}
              options={Countries}
              value={this.getCountry(values.issuingCountry)}
              errorMessage={errors.issuingCountry && intl.formatMessage({
                id: errors.issuingCountry,
              })}
              showError={!!errors.issuingCountry}
              onChange={this.handleChange}
            />
          </div>

          <div className='col-md-6'>
            <InputDate
              name='issueDate'
              label={intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.issue.date.label',
                  defaultMessage: 'Date of issue',
              })}
              placeholder={intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.issue.date.placeholder',
                  defaultMessage: 'DD.MM.YYYY',
              })}
              value={values.issueDate && values.issueDate.toString()}
              errorMessage={errors.issueDate && intl.formatMessage({
                id: errors.issueDate,
              })}
              showError={!!errors.issueDate}
              onChange={this.handleChange}
              mask='**.**.****'
              maskChar={null}
            />
            <InputDate
              name='expirationDate'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.expiration.date.label',
                  defaultMessage: 'Expiration date',
              })}
              placeholder={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.expiration.date.placeholder',
                  defaultMessage: 'DD.MM.YYYY',
              })}
              value={values.expirationDate && values.expirationDate.toString()}
              errorMessage={errors.expirationDate && intl.formatMessage({
                id: errors.expirationDate,
              })}
              showError={!!errors.expirationDate}
              onChange={this.handleChange}
              mask='**.**.****'
              maskChar={null}
            />
          </div>
        </div>

        <div className='row tier1__form-section'>
          <div className='col-md-6'>
            <Input
              name='position'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.position.label',
                  defaultMessage: 'Position',
              })}
              value={values.position}
              errorMessage={errors.position && intl.formatMessage({
                id: errors.position,
              })}
              showError={!!errors.position}
              onChange={this.handleChange}
            />
            <Input
              name='contactPhone'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.contact.phone.label',
                  defaultMessage: 'Contact phone',
              })}
              value={values.contactPhone}
              errorMessage={errors.contactPhone && intl.formatMessage({
                id: errors.contactPhone,
              })}
              showError={!!errors.contactPhone}
              onChange={this.handleChange}
            />
          </div>

          <div className='col-md-6'>
            <Input
              name='representativeEmail'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.email.label',
                  defaultMessage: 'E-mail',
              })}
              value={values.representativeEmail}
              errorMessage={errors.representativeEmail && intl.formatMessage({
                id: errors.representativeEmail,
              })}
              showError={!!errors.representativeEmail}
              onChange={this.handleChange}
            />
          </div>
        </div>

        <div className='row tier1__form-section'>
          <div className='col-12 mb-3'>
            <p className='header_description mb-3 ml-2'>
              {intl.formatMessage({
                id: 'dashboard.kyc.legal.representative.politically.exposed.header',
                defaultMessage: 'Politically exposed person means a natural person who is or who has been ' +
                    'entrusted with prominent public functions including a head of State, head of government, ' +
                    'minister and deputy or assistant minister; a member of parliament or of a similar ' +
                    'legislative body, a member of a governing body of a political party, a member of a ' +
                    'supreme court, a member of a court of auditors or of the board of a central bank; ' +
                    'an ambassador, a chargé d\'affaires and a high-ranking officer in the armed forces; ' +
                    'a member of an administrative, management or supervisory body of a State-owned enterprise; ' +
                    'a director, deputy director and member of the board or equivalent function of an ' +
                    'international organisation, except middleranking or more junior officials.',
              })}
            </p>
            <label className='form__label pl-0 ml-2 mb-2'>
              {intl.formatMessage({
                  id: 'dashboard.kyc.legal.representative.politically.exposed.label',
                  defaultMessage: 'Is the representative of a legal entity a politically exposed person or it`s ' +
                      'family member or a close associate?',
              })}
            </label>
            <div className='d-flex'>
              <RadioButton
                name='politicallyExposed'
                value='yes'
                label={ intl.formatMessage({
                    id: 'dashboard.kyc.legal.representative.politically.exposed.yes.label',
                    defaultMessage: 'Yes',
                })}
                checked={values.politicallyExposed === 'yes'}
                showError={!!errors.politicallyExposed}
                onChange={this.handleChange}
              />
              <RadioButton
                name='politicallyExposed'
                value='no'
                label={ intl.formatMessage({
                    id: 'dashboard.kyc.legal.representative.politically.exposed.no.label',
                    defaultMessage: 'No',
                })}
                checked={values.politicallyExposed === 'no'}
                showError={!!errors.politicallyExposed}
                onChange={this.handleChange}
              />
            </div>
          </div>

          {values.politicallyExposed === 'yes' &&
            <div className='container row'>
              <div className='col-md-6'>
                <Input
                  name='politicallyExposedName'
                  label={intl.formatMessage({
                      id: 'dashboard.kyc.legal.representative.politically.exposed.name.label',
                      defaultMessage: 'Name and last name of the official',
                  })}
                  value={values.politicallyExposedName}
                  errorMessage={errors.politicallyExposedName && intl.formatMessage({
                    id: errors.politicallyExposedName,
                  })}
                  showError={!!errors.politicallyExposedName}
                  onChange={this.handleChange}
                />
              </div>
              <div className='col-md-6'>
                <Input
                  name='politicallyExposedPosition'
                  label={intl.formatMessage({
                      id: 'dashboard.kyc.legal.representative.politically.exposed.position.label',
                      defaultMessage: 'Position',
                  })}
                  value={values.politicallyExposedPosition}
                  errorMessage={errors.politicallyExposedPosition && intl.formatMessage({
                    id: errors.politicallyExposedPosition,
                  })}
                  showError={!!errors.politicallyExposedPosition}
                  onChange={this.handleChange}
                />
              </div>
              <div className='col-12'>
                <label className='form__label'>
                  {intl.formatMessage({
                    id: 'dashboard.kyc.legal.representative.politically.exposed.relation.label',
                    defaultMessage: 'Contact with the client:',
                  })}
                </label>
                <RadioButton
                  classNames='mb-4'
                  name='politicallyExposedRelation'
                  label={ intl.formatMessage({
                      id: 'dashboard.kyc.legal.representative.politically.exposed.relation.self.label',
                      defaultMessage: 'I am a politically exposed person',
                  })}
                  value='self'
                  checked={values.politicallyExposedRelation === 'self'}
                  showError={!!errors.politicallyExposedRelation}
                  onChange={this.handleChange}
                />
                <RadioButton
                  classNames='mb-4'
                  name='politicallyExposedRelation'
                  label={ intl.formatMessage({
                      id: 'dashboard.kyc.legal.representative.politically.exposed.relation.family.label',
                      defaultMessage: 'Family member of a politically exposed person',
                  })}
                  value='family'
                  checked={values.politicallyExposedRelation === 'family'}
                  showError={!!errors.politicallyExposedRelation}
                  onChange={this.handleChange}
                />
                <RadioButton
                  name='politicallyExposedRelation'
                  label={ intl.formatMessage({
                      id: 'dashboard.kyc.legal.representative.politically.exposed.relation.associate.label',
                      defaultMessage: 'Person known to be a close associate of a politically exposed person',
                  })}
                  value='closeAssociate'
                  checked={values.politicallyExposedRelation === 'closeAssociate'}
                  showError={!!errors.politicallyExposedRelation}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default injectIntl(RepresentativeData);
