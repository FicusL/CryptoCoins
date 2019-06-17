import * as React from 'react';
import PersonDataForm from './PersonDataForm';
import { lazyInject } from '../../../../../IoC';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { ManagementPersonalDataStore } from '../store/parts/ManagementPersonalDataStore';
import Button from '../../../../../Shared/components/Buttons/Button';
import { observer } from 'mobx-react';
import CloseIcon from '../../../../../Shared/components/CloseIcon/CloseIcon';

@observer
class ManagementPersonalData extends React.Component<InjectedIntlProps> {
  @lazyInject(ManagementPersonalDataStore)
  store: ManagementPersonalDataStore;

  render() {
    const { intl } = this.props;
    const { persons } = this.store;

    return (
      <div className='pt-4'>
        <p className='header_description col-12 mb-3'>
          {intl.formatMessage({
            id: 'dashboard.kyc.legal.management.personal.data.label',
            defaultMessage: 'If the authorized representative is a director of the company, please enter the data only ' +
              'about members of the management board here. Otherwise, please specify Person 1 as a director and ' +
              'additional Persons as members of the management board.',
          })}
        </p>
        {persons.map((person, i) => (
          <div className='tier1__form-section' key={i} style={{ position: 'relative' }}>
            {i !== 0 && <CloseIcon right='0' onClick={() => this.store.removePerson(i)}/>}
            <h2 className='header mb-4 text--center'>
              { intl.formatMessage({
                  id: 'dashboard.kyc.legal.management.personal.data.person',
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
              id: 'dashboard.kyc.legal.management.personal.data.button',
              defaultMessage: 'Add',
            })}
          </Button>
        </div>
      </div>
    );
  }
}

export default injectIntl(ManagementPersonalData);
