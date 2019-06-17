import './style.scss';
import * as React from 'react';
import Steps from '../components/Steps/Steps';
import { lazyInject } from '../../../../../IoC';
import { Tier1Steps, Tier1Store } from '../stores/Tier1Store';
import { observer } from 'mobx-react';
import Controls from '../components/Controls';
import PersonalInformation from './PersonalInformation';
import BeneficiariesAndRepresentatives from './BeneficiariesAndRepresentatives';
import Documents from './Documents';
import Confirmation from './Confirmation';
import withScrollToError, { IScrollToErrorProps } from '../../../../../Shared/utils/WithScrollToError';
import { LocaleStore } from '../../../../../Shared/stores/LocaleStore';
import { CounterpartyAccountStore } from '../../../../../Counterparty/stores/CounterpartyAccountStore';
import { GET_DATA_KYC, GET_SUMSUB, KycDataStore } from '../stores/KycDataStore';
import { LoaderStore } from '../../../../../Shared/modules/Loader/store/LoaderStore';

@observer
class Tier1Container extends React.Component<{} & IScrollToErrorProps> {
  @lazyInject(Tier1Store)
  readonly store: Tier1Store;

  @lazyInject(KycDataStore)
  readonly kycDataStore: KycDataStore;

  @lazyInject(LoaderStore)
  loaderStore: LoaderStore;

  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  @lazyInject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  componentWillMount(): void {
    this.kycDataStore.getSumSub();
    this.kycDataStore.loadFromDataBase();
  }

  getCurrentStepForm = () => {
    switch (this.store.step) {
      case Tier1Steps.PersonalInformation: return PersonalInformation;
      case Tier1Steps.BeneficiariesAndRepresentatives: return BeneficiariesAndRepresentatives;
      case Tier1Steps.Documents: return Documents;
      case Tier1Steps.Confirmation: return Confirmation;
    }
  };

  onNextStep = () => {
    this.store.nextStep().catch(() => {
      if (this.props.scrollToError) {
        this.props.scrollToError();
      }
    });
  };

  onSubmit = () => {
    this.store.submit().catch(() => {
      if (this.props.scrollToError) {
        this.props.scrollToError();
      }
    });
  };

  onPrevStep = () => {
    this.store.prevStep();
  };

  render() {
    const Form = this.getCurrentStepForm();
    const { locale } = this.localeStore;

    if (this.loaderStore.hasTask(GET_DATA_KYC) || this.loaderStore.hasTask(GET_SUMSUB)) {
      return null;
    }

    return (
      <div className='tier1'>
        <Steps step={this.store.step} prevStep={this.store.prevStep} />
        <Form />
        <Controls
          step={this.store.step}
          nextStep={this.onNextStep}
          prevStep={this.onPrevStep}
          submit={this.onSubmit}
          stepsCount={this.store.stepsCount}
        />
      </div>
    );
  }
}

export default withScrollToError(Tier1Container);