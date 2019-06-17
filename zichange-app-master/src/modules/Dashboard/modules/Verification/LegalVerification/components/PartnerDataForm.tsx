import * as React from 'react';
import Input from '../../../../../Shared/components/Inputs/Input';
import { observer } from 'mobx-react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import SelectSearch from '../../../../../Shared/components/Inputs/SelectSearch';
import { Countries } from '../../../../../Shared/const/Countries';
import { IErrors } from '../../../../../Shared/stores/Forms/BaseFormStore';
import { PartnerValues } from '../store/parts/PartnerStore';

interface IProps {
  values: Partial<PartnerValues>;
  errors: IErrors<PartnerValues>;
  onChange: (name: keyof PartnerValues, value) => void;
}

@observer
class PartnerDataForm extends React.Component<IProps & InjectedIntlProps> {

  handleChange = ({ name, value }) => this.props.onChange(name, value);
  getCountry = (name) => Countries.find(item => item.value === name);

  render() {
    const { intl } = this.props;
    const { values, errors } = this.props;

    return (
      <div className='row'>
        <div className='col-md-6'>
          <Input
            name='name'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.partner.data.form.name.label',
                defaultMessage: 'Name',
            })}
            value={values.name}
            errorMessage={errors.name && intl.formatMessage({
              id: errors.name,
            })}
            showError={!!errors.name}
            onChange={this.handleChange}
          />
          <Input
            name='activity'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.partner.data.form.activity.label',
                defaultMessage: 'Kind of activity',
            })}
            value={values.activity}
            errorMessage={errors.activity && intl.formatMessage({
              id: errors.activity,
            })}
            showError={!!errors.activity}
            onChange={this.handleChange}
          />
        </div>
        <div className='col-md-6'>
          <Input
            name='regNumber'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.partner.data.form.number.label',
                defaultMessage: 'Reg. Number',
            })}
            value={values.regNumber}
            errorMessage={errors.regNumber && intl.formatMessage({
              id: errors.regNumber,
            })}
            showError={!!errors.regNumber}
            onChange={this.handleChange}
          />
          <SelectSearch
            name='regCountry'
            label={ intl.formatMessage({
                id: 'dashboard.kyc.legal.partner.data.form.country.label',
                defaultMessage: 'Country of registration',
            })}
            options={Countries}
            value={this.getCountry(values.regCountry)}
            errorMessage={errors.regCountry && intl.formatMessage({
              id: errors.regCountry,
            })}
            showError={!!errors.regCountry}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

export default injectIntl(PartnerDataForm);
