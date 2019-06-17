import './style.scss';
import * as React from 'react';
import cn from 'classnames';
import { Tier1Steps } from '../../stores/Tier1Store';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../../IoC';
import { LocaleStore } from '../../../../../../Shared/stores/LocaleStore';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { ColorStore } from '../../../../../../Admin/modules/Counterparty/stores/Colors/ColorStore';
import { RGBA } from '../../../../../../Shared/types/IRGBA';

interface IProps {
  step: Tier1Steps;
  prevStep: () => void;
}

@observer
class Steps extends React.Component<IProps & InjectedIntlProps> {
  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  @lazyInject(ColorStore)
  colorStore: ColorStore;

  handleChange = (currentStep, toStep) => {
    for (let i = 0; i <= currentStep - toStep - 1; i++) {
      this.props.prevStep();
    }
  };

  render() {
    const { step, intl } = this.props;
    const { locale } = this.localeStore;

    return (
      <div className={`kyc__steps step-${step}`}>
        <div className={cn(
          'step',
              {'step--active': step === Tier1Steps.PersonalInformation},
              {'step--hoverable' : step !== Tier1Steps.PersonalInformation},
            )}
             onClick={ () => step !== 0 &&  this.handleChange(step, 0)}
             style={this.colorStore.isLoaded ? {color: RGBA.toRGBAString(this.colorStore.styles.body.color)} : {}}>
            {intl.formatMessage({
                id: 'dashboard.verification.natural.steps.personal.info',
                defaultMessage: 'Personal Information',
            })}
        </div>
        <div className={cn(
          'step pl-3',
              {'step--active': step === Tier1Steps.BeneficiariesAndRepresentatives},
              {'step--hoverable' : step > 1},
            )}
             onClick={ () => step > 1 &&  this.handleChange(step, 1)}
             style={this.colorStore.isLoaded ? {color: RGBA.toRGBAString(this.colorStore.styles.body.color)} : {}}>
            {intl.formatMessage({
                id: 'dashboard.verification.natural.steps.beneficiaries',
                defaultMessage: 'Beneficiaries and Representatives',
            })}
        </div>
        <div className={cn(
          'step',
              {'step--active': step === Tier1Steps.Documents},
              {'step--hoverable' : step > 2},
            )}
             onClick={ () => step > 2 &&  this.handleChange(step, 2)}
             style={this.colorStore.isLoaded ? {color: RGBA.toRGBAString(this.colorStore.styles.body.color)} : {}}>
            {intl.formatMessage({
                id: 'dashboard.verification.natural.steps.photos',
                defaultMessage: 'Photos of Documents',
            })}
        </div>
        <div className={cn('step', {'step--active': step === Tier1Steps.Confirmation})}
             style={this.colorStore.isLoaded ? {color: RGBA.toRGBAString(this.colorStore.styles.body.color)} : {}}>
            {intl.formatMessage({
                id: 'dashboard.verification.natural.steps.confirmation',
                defaultMessage: 'Confirmation',
            })}
        </div>
      </div>
    );
  }
}

export default injectIntl(Steps);