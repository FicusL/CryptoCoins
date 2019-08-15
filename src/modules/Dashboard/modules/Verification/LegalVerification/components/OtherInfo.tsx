import * as React from 'react';
import TextArea from '../../../../../Shared/components/Inputs/TextArea/TextArea';
import RadioButton from '../../../../../Shared/components/Inputs/RadioButton/RadioButton';
import CheckBox from '../../../../../Shared/components/Inputs/Checkbox/Checkbox';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { OtherInfoStore } from '../store/parts/OtherInfoStore';

@observer
class OtherInfo extends React.Component<InjectedIntlProps> {
  @lazyInject(OtherInfoStore)
  store: OtherInfoStore;

  handleChange = ({ name, value }) => this.store.change(name, value);

  render() {
    const { intl } = this.props;
    const { values, errors } = this.store;

    return (
      <div className='row tier1__form-section'>
        <div className='col-12'>
          <label className='form__label'>
            { intl.formatMessage({
              id: 'dashboard.kyc.legal.other.info.international.activity.label',
              defaultMessage: 'Is the activity conducted with other states (international activity)?',
            })}
          </label>
          <div className='d-flex mb-4'>
            <RadioButton
              name='internationalActivity'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.other.info.international.activity.radio.yes.label',
                  defaultMessage: 'Yes',
              })}
              value='yes'
              checked={values.internationalActivity === 'yes'}
              showError={!!errors.internationalActivity}
              onChange={this.handleChange}
            />
            <RadioButton
              name='internationalActivity'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.other.info.international.activity.radio.no.label',
                  defaultMessage: 'No',
              })}
              value='no'
              checked={values.internationalActivity === 'no'}
              showError={!!errors.internationalActivity}
              onChange={this.handleChange}
            />
          </div>
          {values.internationalActivity === 'yes' &&
            <TextArea
              name='descriptionInternationalActivity'
              label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.other.info.international.activity.text.label',
                defaultMessage: 'List of countries that the company intends to conduct activity with',
              })}
              value={values.descriptionInternationalActivity}
              errorMessage={errors.descriptionInternationalActivity && intl.formatMessage({
                id: errors.descriptionInternationalActivity,
              })}
              showError={!!errors.descriptionInternationalActivity}
              onChange={this.handleChange}
            />
          }
          <label className='form__label'>
            { intl.formatMessage({
                id: 'dashboard.kyc.legal.other.info.work.offshore.label',
                defaultMessage: 'Does the company work with offshore companies / banks?',
            })}
          </label>
          <div className='d-flex mb-4'>
            <RadioButton
              name='workOffshore'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.other.info.work.offshore.radio.yes.label',
                  defaultMessage: 'Yes',
              })}
              value='yes'
              checked={values.workOffshore === 'yes'}
              showError={!!errors.workOffshore}
              onChange={this.handleChange}
            />
            <RadioButton
              name='workOffshore'
              label={ intl.formatMessage({
                  id: 'dashboard.kyc.legal.other.info.work.offshore.radio.no.label',
                  defaultMessage: 'No',
              })}
              value='no'
              checked={values.workOffshore === 'no'}
              showError={!!errors.workOffshore}
              onChange={this.handleChange}
            />
          </div>
          {values.workOffshore === 'yes' &&
            <TextArea
              name='descriptionWorkOffshore'
              label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.other.info.work.offshore.text.label',
                defaultMessage: 'List of offshore companies/banks that the company works with',
              })}
              value={values.descriptionWorkOffshore}
              errorMessage={errors.descriptionWorkOffshore && intl.formatMessage({
                id: errors.descriptionWorkOffshore,
              })}
              showError={!!errors.descriptionWorkOffshore}
              onChange={this.handleChange}
            />
          }

          <label className='form__label'>
            { intl.formatMessage({
              id: 'dashboard.kyc.legal.other.info.control.structure.label',
              defaultMessage: 'Has the legal entity or any entity within the control structure issued bearer shares?',
            })}
          </label>
          <div className='d-flex mb-4'>
            <RadioButton
              name='controlStructure'
              label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.other.info.control.structure.radio.yes.label',
                defaultMessage: 'Yes',
              })}
              value='yes'
              checked={values.controlStructure === 'yes'}
              showError={!!errors.controlStructure}
              onChange={this.handleChange}
            />
            <RadioButton
              name='controlStructure'
              label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.other.info.control.structure.radio.no.label',
                defaultMessage: 'No',
              })}
              value='no'
              checked={values.controlStructure === 'no'}
              showError={!!errors.controlStructure}
              onChange={this.handleChange}
            />
          </div>
          {values.controlStructure === 'yes' &&
            <TextArea
              name='descriptionControlStructure'
              label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.other.info.control.structure.text.label',
                defaultMessage: 'Please kindly provide further information',
              })}
              value={values.descriptionControlStructure}
              errorMessage={errors.descriptionControlStructure && intl.formatMessage({
                id: errors.descriptionControlStructure,
              })}
              showError={!!errors.descriptionControlStructure}
              onChange={this.handleChange}
            />
          }
          <TextArea
            name='incomeSource'
            label=
              { intl.formatMessage({
                  id: 'dashboard.kyc.legal.other.info.income.source.text.label',
                  defaultMessage: 'The main source of origin of the company\'s funds (income)',
              })}
            value={values.incomeSource}
            errorMessage={errors.incomeSource && intl.formatMessage({
              id: errors.incomeSource,
            })}
            showError={!!errors.incomeSource}
            onChange={this.handleChange}
          />
          <TextArea
            name='costs'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.other.info.costs.text.label',
                defaultMessage: 'Basic payments of the company (costs)',
            })}
            value={values.costs}
            errorMessage={errors.costs && intl.formatMessage({
              id: errors.costs,
            })}
            showError={!!errors.costs}
            onChange={this.handleChange}
          />
          <TextArea
            name='additionalInfo'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.other.info.additional.info.text.label',
                defaultMessage: 'Additional information and notes',
            })}
            value={values.additionalInfo}
            errorMessage={errors.additionalInfo && intl.formatMessage({
              id: errors.additionalInfo,
            })}
            showError={!!errors.additionalInfo}
            onChange={this.handleChange}
          />
          <label className='form__label'>
            { intl.formatMessage({
                id: 'dashboard.kyc.legal.other.info.confirm.label',
                defaultMessage: 'By signing this questionnaire:',
            })}
          </label>
          <CheckBox
            name='confirm1'
            className='mb-3'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.other.info.confirm1.label',
                defaultMessage: 'I confirm that the information provided in this questionnaire is current, ' +
                    'complete and accurate;',
            })}
            checked={values.confirm1}
            showError={!!errors.confirm1}
            onChange={this.handleChange}
          />
          <CheckBox
            name='confirm2'
            className='mb-3'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.other.info.confirm2.label',
                defaultMessage: 'I undertake to notify BaGuk Finance OÜ within 15 days of any changes in the ' +
                    'circumstances in which the information provided herein is deemed to be incorrect, incomplete, ' +
                    'or obsolete;',
            })}
            checked={values.confirm2}
            showError={!!errors.confirm2}
            onChange={this.handleChange}
          />
          <CheckBox
            name='confirm3'
            className='mb-4'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.other.info.confirm3.label',
                defaultMessage: 'I confirm that I am aware of my responsibility to provide correct data. I consent ' +
                    'to the processing of my personal data.',
            })}
            checked={values.confirm3}
            showError={!!errors.confirm3}
            onChange={this.handleChange}
          />
          <CheckBox
            name='confirm4'
            className='mb-3'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.other.info.confirm4.label',
                defaultMessage: 'I permit BaGuk Finance OÜ (location: Narva mnt 13, Tallinn 10151, Estonia, registration' +
                  ' code 14432499) to transfer the information contained in this form to the regulatory authorities, ' +
                  'in order to comply with the requirements of applicable law, including with regard to combating the ' +
                  'legalization (laundering) of proceeds from crime and financing of terrorism, as well as reporting to ' +
                  'the tax authorities. I permit BaGuk Finance OÜ to transfer information contained in this form to ' +
                  'third parties for the purpose of assisting with the customer due diligence processes;',
            })}
            checked={values.confirm4}
            showError={!!errors.confirm4}
            onChange={this.handleChange}
          />
          <CheckBox
            name='confirm5'
            className='mb-4'
            label={ intl.formatMessage({
              id: 'dashboard.kyc.legal.other.info.confirm5.label',
              defaultMessage: 'I confirm that any failure to act in terms of the above will constitute a breach of these' +
                ' General Terms and BaGuk Finance OÜ will be entitled to terminate the relationship by cancelling or ' +
                'closing any product or service, subject to BaGuk Finance OÜ’s right to demand payment of any fee or ' +
                'charge that is due for any such service or product.',
            })}
            checked={values.confirm5}
            showError={!!errors.confirm5}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

export default injectIntl(OtherInfo);
