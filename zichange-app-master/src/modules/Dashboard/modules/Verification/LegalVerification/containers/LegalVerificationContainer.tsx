import * as React from 'react';
import Controls from '../../NaturalVerification/components/Controls/index';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { LegalVerificationStore } from '../store/LegalVerificationStore';
import CustomerInformation from '../components/CustomerInformation';
import RepresentativeData from '../components/RepresentativeData';
import ManagementPersonalData from '../components/ManagementPersonalData';
import BeneficiariesData from '../components/BeneficiariesData';
import MainPartners from '../components/MainPartners';
import OtherInfo from '../components/OtherInfo';
import withScrollToError, { IScrollToErrorProps } from '../../../../../Shared/utils/WithScrollToError';
import Steps from '../components/Steps/Steps';

@observer
class LegalVerificationContainer extends React.Component<IScrollToErrorProps> {
  @lazyInject(LegalVerificationStore)
  store: LegalVerificationStore;

  forms = [
    CustomerInformation,
    RepresentativeData,
    ManagementPersonalData,
    BeneficiariesData,
    MainPartners,
    OtherInfo,
  ];

  onNextStep = () => this.store.nextStep().catch(() => this.props.scrollToError());
  onPrevStep = () => this.store.prevStep();

  render() {
    const Form = this.forms[this.store.step];

    return (
      <div className='legal-kyc'>
        <Steps steps={this.store.steps}
               active={this.store.step}
        />
        <Form />
        <Controls
          step={this.store.step}
          nextStep={this.onNextStep}
          prevStep={this.onPrevStep}
          submit={this.store.submit}
          stepsCount={this.store.steps.length}
        />
      </div>
    );
  }
}

export default withScrollToError(LegalVerificationContainer);
