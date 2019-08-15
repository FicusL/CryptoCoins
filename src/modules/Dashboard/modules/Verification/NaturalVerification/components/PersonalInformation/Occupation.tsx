import * as React from 'react';
import { IOnChangeProps } from '../../../../../../Shared/types/IChangeProps';
import RadioButton from '../../../../../../Shared/components/Inputs/RadioButton/RadioButton';
import Input from '../../../../../../Shared/components/Inputs/Input';
import { observer } from 'mobx-react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { PersonalInformationValues } from '../../stores/parts/PersonalInformationStore';
import { lazyInject } from '../../../../../../IoC';
import { LocaleStore } from '../../../../../../Shared/stores/LocaleStore';

interface IProps {
  handleChange: (changeProps: IOnChangeProps) => void;
  values: any;
  errors: any;
}

@observer
class Occupation extends React.Component<IProps & InjectedIntlProps> {
  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  render() {
    const { handleChange, values, errors } = this.props;

    const isDisabled = PersonalInformationValues.NON_VALIDATION_OCCUPATIONS.has(values.occupation || '');
    const { contactPhone, positionLabel, fieldOfActivity,
            contactAdress, companyOrUniverName, headerDesc,
            otherRadio, selfemployedRadio, unemployedRadio,
            officialRadio, studentRadio, retiredRadio,
            employeeRadio } = this.getLocalizedData();
    return (
      <div className='row tier1__form-section'>
        <h2 className='header col-12 mb-4 text--center'>
          Occupation
        </h2>
        <div className='col-12 col-sm-6 col-md-4 col-xl'>
          <RadioButton
            name='occupation'
            value='employee'
            label={employeeRadio}
            checked={values.occupation === 'employee'}
            onChange={handleChange}
            showError={!!errors.occupation}
            classNames='mb-3'
          />
        </div>
        <div className='col-12 col-sm-6 col-md-4 col-xl'>
          <RadioButton
            name='occupation'
            value='retired'
            label={retiredRadio}
            checked={values.occupation === 'retired'}
            onChange={handleChange}
            showError={!!errors.occupation}
          />
        </div>
        <div className='col-12 col-sm-6 col-md-4 col-xl'>
          <RadioButton
            name='occupation'
            value='student'
            label={studentRadio}
            checked={values.occupation === 'student'}
            onChange={handleChange}
            showError={!!errors.occupation}
          />
        </div>
        <div className='col-12 col-sm-6 col-md-4 col-xl'>
          <RadioButton
            name='occupation'
            value='stateOfficial'
            label={officialRadio}
            checked={values.occupation === 'stateOfficial'}
            onChange={handleChange}
            showError={!!errors.occupation}
            classNames='pl-0'
          />
        </div>
        <div className='col-12 col-sm-6 col-md-4 col-xl'>
          <RadioButton
            name='occupation'
            value='unemployed'
            label={unemployedRadio}
            checked={values.occupation === 'unemployed'}
            onChange={handleChange}
            showError={!!errors.occupation}
            classNames='pl-0'
          />
        </div>
        <div className='col-12 col-sm-6 col-md-4 col-xl'>
          <RadioButton
            name='occupation'
            value='selfEmployed'
            label={selfemployedRadio}
            checked={values.occupation === 'selfEmployed'}
            onChange={handleChange}
            showError={!!errors.occupation}
            classNames='pl-0'
          />
        </div>
        <div className='col-12 align-self-center occupation__form-section'>
          <RadioButton
            name='occupation'
            value='other'
            checked={values.occupation === 'other'}
            label={otherRadio}
            onChange={handleChange}
            showError={!!errors.occupation}
            classNames='mb-2'
          />
          <Input
            disabled={values.occupation !== 'other'}
            name='otherOccupation'
            value={values.otherOccupation}
            onChange={handleChange}
            showError={!!errors.otherOccupation}
            errorMessage={errors.otherOccupation}
          />
        </div>
        <p className='header_description col-12 mb-3'>
          {headerDesc}
        </p>
        <div className='col-md-6'>
          <Input
            disabled={isDisabled}
            name='companyOrUniversityName'
            label={companyOrUniverName}
            value={values.companyOrUniversityName}
            onChange={handleChange}
            showError={!!errors.companyOrUniversityName}
            errorMessage={errors.companyOrUniversityName}
          />
          <Input
            disabled={isDisabled}
            name='contactAddress'
            label={contactAdress}
            value={values.contactAddress}
            onChange={handleChange}
            showError={!!errors.contactAddress}
            errorMessage={errors.contactAddress}
          />
          <Input
            disabled={isDisabled}
            name='activityField'
            label={fieldOfActivity}
            value={values.activityField}
            onChange={handleChange}
            showError={!!errors.activityField}
            errorMessage={errors.activityField}
          />
        </div>
        <div className='col-md-6'>
          <Input
            disabled={isDisabled}
            name='position'
            label={positionLabel}
            value={values.position}
            onChange={handleChange}
            showError={!!errors.position}
            errorMessage={errors.position}
          />
          <Input
            disabled={isDisabled}
            name='workContactPhone'
            label={contactPhone}
            value={values.workContactPhone}
            onChange={handleChange}
            showError={!!errors.workContactPhone}
            errorMessage={errors.workContactPhone}
          />
        </div>
      </div>
    );
  }
  getLocalizedData() {
    const { intl } = this.props;

    const employeeRadio = intl.formatMessage({
      id: 'dashboard.kyc.tier1.occupation.employeeRadio',
      defaultMessage: 'Employee',
    });
    const retiredRadio = intl.formatMessage({
      id: 'dashboard.kyc.tier1.occupation.retiredRadio',
      defaultMessage: 'Retired',
    });
    const studentRadio = intl.formatMessage({
      id: 'dashboard.kyc.tier1.occupation.studentRadio',
      defaultMessage: 'Student',
    });
    const officialRadio = intl.formatMessage({
      id: 'dashboard.kyc.tier1.occupation.officialRadio',
      defaultMessage: 'State official',
    });
    const unemployedRadio = intl.formatMessage({
      id: 'dashboard.kyc.tier1.occupation.unemployedRadio',
      defaultMessage: 'Unemployed',
    });
    const selfemployedRadio = intl.formatMessage({
      id: 'dashboard.kyc.tier1.occupation.selfemployedRadio',
      defaultMessage: 'Self-employed',
    });
    const otherRadio = intl.formatMessage({
      id: 'dashboard.kyc.tier1.occupation.otherRadio',
      defaultMessage: 'Other',
    });
    const headerDesc = intl.formatMessage({
      id: 'dashboard.kyc.tier1.occupation.headerDesc',
      defaultMessage: 'Please leave blank if you have chosen "unemployed", "self-employed" or "retired" in the previous paragraph',
    });
    const companyOrUniverName = intl.formatMessage({
      id: 'dashboard.kyc.tier1.occupation.companyOrUniverName',
      defaultMessage: 'Company/University Name',
    });
    const contactAdress = intl.formatMessage({
      id: 'dashboard.kyc.tier1.occupation.contactAdress',
      defaultMessage: 'Contact Address',
    });
    const fieldOfActivity = intl.formatMessage({
      id: 'dashboard.kyc.tier1.occupation.fieldOfActivity',
      defaultMessage: 'Field of activity',
    });
    const positionLabel = intl.formatMessage({
      id: 'dashboard.kyc.tier1.beneficiaries.positionLabel',
      defaultMessage: 'Position',
    });
    const contactPhone = intl.formatMessage({
      id: 'dashboard.kyc.tier1.occupation.contactPhone',
      defaultMessage: 'Contact Phone',
    });

    return {
      contactPhone, positionLabel, fieldOfActivity,
      contactAdress, companyOrUniverName, headerDesc,
      otherRadio, selfemployedRadio, unemployedRadio,
      officialRadio, studentRadio, retiredRadio,
      employeeRadio,
    };
  }
}

export default injectIntl(Occupation);