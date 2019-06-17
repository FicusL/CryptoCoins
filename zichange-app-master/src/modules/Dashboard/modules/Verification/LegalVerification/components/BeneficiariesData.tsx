import * as React from 'react';
import PersonDataForm from './PersonDataForm';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { BeneficiariesDataStore } from '../store/parts/BeneficiariesDataStore';
import CloseIcon from '../../../../../Shared/components/CloseIcon/CloseIcon';
import Button from '../../../../../Shared/components/Buttons/Button';

@observer
class BeneficiariesData extends React.Component<InjectedIntlProps> {
  @lazyInject(BeneficiariesDataStore)
  store: BeneficiariesDataStore;

  render() {
    const { intl } = this.props;
    const { persons } = this.store;

    return (
      <div>
        <p className='header_description mb-3 ml-2'>
          { intl.formatMessage({
            id: 'dashboard.kyc.legal.beneficiaries.header',
            defaultMessage: 'A beneficial owner means any natural person(s) who ultimately owns or controls a legal ' +
              'person and/or the natural person(s) on whose behalf a transaction or activity is being conducted and ' +
              'includes at least direct or indirect ownership of a sufficient percentage (a shareholding of 25% plus' +
              ' one share or an ownership interest of more than 25%), including through bearer shareholdings, ' +
              'or through control via other means.',
          })}
        </p>
        {persons.map((person, i) => (
          <div className='tier1__form-section' key={i} style={{ position: 'relative' }}>
            {i !== 0 && <CloseIcon right='0' onClick={() => this.store.removePerson(i)}/>}
            <h2 className='header mb-4 text--center'>
                { intl.formatMessage({
                  id: 'dashboard.kyc.legal.beneficiaries.persons',
                  defaultMessage: 'Person ',
                })}
                {i + 1}
            </h2>
            <PersonDataForm
              values={person.values}
              errors={person.errors}
              onChange={person.change}
            />
          </div>
        ))}
        <div className='container row justify-content-center mb-5'>
          <Button name='white' onClick={this.store.addPerson} style={{ float: 'left' }}>
            { intl.formatMessage({
              id: 'dashboard.kyc.legal.beneficiaries.button',
              defaultMessage: 'Add',
            })}
          </Button>
        </div>

      </div>
    );
  }
}

export default injectIntl(BeneficiariesData);
