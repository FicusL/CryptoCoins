import * as React from 'react';
import { Countries } from '../../../../../../Shared/const/Countries';
import Select from '../../../../../../Shared/components/Inputs/Select';
import Input from '../../../../../../Shared/components/Inputs/Input';
import { IOnChangeProps } from '../../../../../../Shared/types/IChangeProps';
import { observer } from 'mobx-react';
import InputDate from '../../../../../../Shared/components/Inputs/InputDate';
import SelectSearch from '../../../../../../Shared/components/Inputs/SelectSearch';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { lazyInject } from '../../../../../../IoC';
import { LocaleStore } from '../../../../../../Shared/stores/LocaleStore';

interface IProps {
  handleChange: (changeProps: IOnChangeProps) => void;
  values: any;
  errors: any;
}

@observer
class Identification extends React.Component<IProps & InjectedIntlProps> {
  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  render() {
    const { handleChange, values, errors } = this.props;
    const { intl } = this.props;

    return (
      <div className='row tier1__form-section'>
        <h2 className='header col-12 mb-4 text--center'>
           {
             intl.formatMessage({
              id: 'dashboard.kyc.tier1.identification.title',
              defaultMessage: 'Identification',
              })
            }
        </h2>
        <div className='col-md-6'>
          <Select
            name='docType'
            label={intl.formatMessage({
              id: 'dashboard.kyc.tier1.identification.doctypeLabel',
              defaultMessage: 'Document Type',
            })}
            value={values.docType}
            options={[
              {value: 0, label: intl.formatMessage({
                id: 'dashboard.kyc.tier1.identification.selectDocument.option1',
                defaultMessage: 'International Passport',
              })},
              {value: 1, label: intl.formatMessage({
                id: 'dashboard.kyc.tier1.identification.selectDocument.option2',
                defaultMessage: 'Driver License',
              })},
              {value: 2, label: intl.formatMessage({
                id: 'dashboard.kyc.tier1.identification.selectDocument.option3',
                defaultMessage: 'ID Card',
              })},
            ]}
            placeholder={intl.formatMessage({
              id: 'dashboard.kyc.tier1.identification.doctypePlaceholder',
              defaultMessage: 'Select the document type',
            })}
            onChange={handleChange}
            showError={!!errors.docType}
            errorMessage={errors.docType}
          />
          <SelectSearch
            name='issuingCountry'
            label='Issuing Country'
            value={values.issuingCountry}
            options={Countries}
            placeholder={intl.formatMessage({
              id: 'dashboard.kyc.tier1.identification.selectCountryOfIssue',
              defaultMessage: 'Select country of issue',
            })}
            onChange={handleChange}
            showError={!!errors.issuingCountry}
            errorMessage={errors.issuingCountry}
          />
          <Input
            name='issuingOrganization'
            label={intl.formatMessage({
              id: 'dashboard.kyc.tier1.identification.issuingOrganization',
              defaultMessage: 'Issuing Organization',
            })}
            value={values.issuingOrganization}
            onChange={handleChange}
            showError={!!errors.issuingOrganization}
            errorMessage={errors.issuingOrganization}
          />
        </div>
        <div className='col-md-6'>
          <Input
            name='docNumber'
            label={intl.formatMessage({
              id: 'dashboard.kyc.tier1.identification.documentNumber',
              defaultMessage: 'Document Number',
            })}
            value={values.docNumber}
            onChange={handleChange}
            showError={!!errors.docNumber}
            errorMessage={errors.docNumber}
          />
          <InputDate
            name='issueDate'
            label={intl.formatMessage({
              id: 'dashboard.kyc.tier1.identification.dateOfIssue',
              defaultMessage: 'Date of Issue',
            })}
            placeholder={intl.formatMessage({
              id: 'dashboard.kyc.tier1.personalInfo.birthDatePlaceholder',
              defaultMessage: 'DD.MM.YYYY',
            })}
            value={values.issueDate && values.issueDate.toString()}
            onChange={handleChange}
            showError={!!errors.issueDate}
            errorMessage={errors.issueDate}
            mask='**.**.****'
            maskChar={null}
          />
          <InputDate
            name='expirationDate'
            label={intl.formatMessage({
              id: 'dashboard.kyc.tier1.identification.expirationDate',
              defaultMessage: 'Expiration Date',
            })}
            placeholder={intl.formatMessage({
              id: 'dashboard.kyc.tier1.personalInfo.birthDatePlaceholder',
              defaultMessage: 'DD.MM.YYYY',
            })}
            value={values.expirationDate && values.expirationDate.toString()}
            onChange={handleChange}
            showError={!!errors.expirationDate}
            errorMessage={errors.expirationDate}
            mask='**.**.****'
            maskChar={null}
          />
        </div>
      </div>
    );
  }
}

export default injectIntl(Identification);
