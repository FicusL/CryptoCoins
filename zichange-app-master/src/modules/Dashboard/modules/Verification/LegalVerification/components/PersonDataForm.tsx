import * as React from 'react';
import { Countries } from '../../../../../Shared/const/Countries';
import Input from '../../../../../Shared/components/Inputs/Input';
import SelectSearch from '../../../../../Shared/components/Inputs/SelectSearch';
import RadioButton from '../../../../../Shared/components/Inputs/RadioButton/RadioButton';
import InputDate from '../../../../../Shared/components/Inputs/InputDate';
import { observer } from 'mobx-react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { PersonValues } from '../store/parts/PersonStore';
import { IErrors } from '../../../../../Shared/stores/Forms/BaseFormStore';

interface IProps {
  values: Partial<PersonValues>;
  errors: IErrors<PersonValues>;
  onChange: (name: keyof PersonValues, value) => void;
}

@observer
class PersonDataForm extends React.Component<IProps & InjectedIntlProps> {
  handleChange = ({ name, value }) => this.props.onChange(name, value);
  getCountry = (name) => Countries.find(item => item.value === name);

  render() {
    const { intl } = this.props;
    const { values, errors } = this.props;

    return (
      <div className='row'>
        <div className='col-md-6'>
          <Input
            name='firstName'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.person.data.first.name.label',
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
                id: 'dashboard.kyc.legal.person.data.last.name.label',
                defaultMessage: 'Last name',
            })}
            value={values.lastName}
            errorMessage={errors.lastName && intl.formatMessage({
              id: errors.lastName,
            })}
            showError={!!errors.lastName}
            onChange={this.handleChange}
          />
          <InputDate
            name='birthDate'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.person.data.date.birth.label',
                defaultMessage: 'Date of birth',
            })}
            placeholder={ intl.formatMessage({
                id: 'dashboard.kyc.legal.person.data.date.birth.placeholder',
                defaultMessage: 'DD.MM.YYYY',
            })}
            value={values.birthDate && values.birthDate.toString()}
            errorMessage={errors.birthDate && intl.formatMessage({
              id: errors.birthDate,
            })}
            showError={!!errors.birthDate}
            onChange={this.handleChange}
            mask='**.**.****'
            maskChar={null}
          />
        </div>
        <div className='col-md-6'>
          <SelectSearch
            name='country'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.person.data.country.label',
                defaultMessage: 'Place of birth',
            })}
            placeholder={ intl.formatMessage({
                id: 'dashboard.kyc.legal.person.data.country.placeholder',
                defaultMessage: 'Select the place of your birth',
            })}
            options={Countries}
            value={this.getCountry(values.country)}
            errorMessage={errors.country && intl.formatMessage({
              id: errors.country,
            })}
            showError={!!errors.country}
            onChange={this.handleChange}
          />
          <Input
            name='personalCode'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.person.data.personal.code.label',
                defaultMessage: 'Personal code (if any)',
            })}
            value={values.personalCode}
            errorMessage={errors.personalCode && intl.formatMessage({
              id: errors.personalCode,
            })}
            showError={!!errors.personalCode}
            onChange={this.handleChange}
          />
          <SelectSearch
            name='residenceCountry'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.person.data.residence.label',
                defaultMessage: 'Country of residence',
            })}
            placeholder={ intl.formatMessage({
                id: 'dashboard.kyc.legal.person.data.residence.placeholder',
                defaultMessage: 'Select the country of your residence',
            })}
            options={Countries}
            value={this.getCountry(values.residenceCountry)}
            errorMessage={errors.residenceCountry && intl.formatMessage({
              id: errors.residenceCountry,
            })}
            showError={!!errors.residenceCountry}
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
        <div className='col-12'>
          <label className='form__label'>
            { intl.formatMessage({
                id: 'dashboard.kyc.legal.person.data.politically.exposed.relation.form.label',
                defaultMessage: 'Is the representative of a legal entity a politically exposed person or it`s family ' +
                    'member or a close associate?',
            })}
          </label>
          <div className='d-flex mb-3'>
            <RadioButton
              name='politicallyExposed'
              value='yes'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.person.data.politically.exposed.relation.yes.label',
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
                  id: 'dashboard.kyc.legal.person.data.politically.exposed.relation.no.label',
                  defaultMessage: 'No',
              })}
              checked={values.politicallyExposed === 'no'}
              showError={!!errors.politicallyExposed}
              onChange={this.handleChange}
            />
          </div>
          {values.politicallyExposed === 'yes' &&
            <div className='row'>
              <div className='col-md-6'>
                <Input
                  name='politicallyExposedName'
                  label={ intl.formatMessage({
                      id: 'dashboard.kyc.legal.person.data.politically.exposed.relation.name.label',
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
                  label={ intl.formatMessage({
                      id: 'dashboard.kyc.legal.person.data.politically.exposed.relation.position.label',
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
                  { intl.formatMessage({
                      id: 'dashboard.kyc.legal.person.data.politically.exposed.form.label',
                      defaultMessage: 'Contact with the client:',
                  })}
                </label>
                <RadioButton
                  classNames='mb-4'
                  name='politicallyExposedRelation'
                  label={ intl.formatMessage({
                      id: 'dashboard.kyc.legal.person.data.politically.exposed.relation.self.label',
                      defaultMessage: 'I am a politically exposed person',
                  })}
                  value='self'
                  checked={values.politicallyExposedRelation === 'self'}
                  showError={!!errors.politicallyExposed}
                  onChange={this.handleChange}
                />
                <RadioButton
                  classNames='mb-4'
                  name='politicallyExposedRelation'
                  label={ intl.formatMessage({
                      id: 'dashboard.kyc.legal.person.data.politically.exposed.relation.family.label',
                      defaultMessage: 'Family member of a politically exposed person',
                  })}
                  value='family'
                  checked={values.politicallyExposedRelation === 'family'}
                  showError={!!errors.politicallyExposed}
                  onChange={this.handleChange}
                />
                <RadioButton
                  name='politicallyExposedRelation'
                  label={ intl.formatMessage({
                      id: 'dashboard.kyc.legal.person.data.politically.exposed.relation.person.label',
                      defaultMessage: 'Person known to be a close associate of a politically exposed person',
                  })}
                  value='closeAssociate'
                  checked={values.politicallyExposedRelation === 'closeAssociate'}
                  showError={!!errors.politicallyExposed}
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

export default injectIntl(PersonDataForm);
