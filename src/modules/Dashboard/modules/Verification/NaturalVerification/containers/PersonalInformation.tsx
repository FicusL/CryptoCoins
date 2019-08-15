import * as React from 'react';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { PersonalInformationStore } from '../stores/parts/PersonalInformationStore';
import PersonalInformationForm from '../components/PersonalInformation/PersonalInformationForm';
import Addresses from '../components/PersonalInformation/Addresses';
import TaxResidency from '../components/PersonalInformation/TaxResidency';
import { injectIntl, InjectedIntlProps } from 'react-intl';

@observer
class PersonalInformation extends React.Component<InjectedIntlProps> {
  @lazyInject(PersonalInformationStore)
  readonly store: PersonalInformationStore;

  componentWillMount(): void {
    this.store.loadLocalStorage();
  }

  handleChange = ({ name, value }) => {
    this.store.change(name, value);
    window.localStorage.setItem(name, value);
  };

  render() {
    return (
      <div>
        <PersonalInformationForm
          values={this.store.values} errors={this.store.errors} handleChange={this.handleChange}/>
        <Addresses
          values={this.store.values} errors={this.store.errors} handleChange={this.handleChange} />
        <TaxResidency
          values={this.store.values} errors={this.store.errors} handleChange={this.handleChange} />
      </div>
    );
  }
}

export default injectIntl(PersonalInformation);
