import * as React from 'react';
import Button from '../../../../../../Shared/components/Buttons/Button';
import { Tier1Steps } from '../../stores/Tier1Store';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import './style.scss';
import { lazyInject } from '../../../../../../IoC';
import { LocaleStore } from '../../../../../../Shared/stores/LocaleStore';
import { CounterpartyAccountStore } from '../../../../../../Counterparty/stores/CounterpartyAccountStore';
import { ColorStore } from '../../../../../../Admin/modules/Counterparty/stores/Colors/ColorStore';

interface IProps {
  stepsCount: number;
  step: Tier1Steps;
  nextStep: () => void;
  prevStep: () => void;
  submit: () => void;
}


class Controls extends React.Component<IProps & InjectedIntlProps> {
  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  @lazyInject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  @lazyInject(ColorStore)
  colorStore: ColorStore;

  render() {
    const { step, prevStep, nextStep, submit, stepsCount } = this.props;
    const { intl } = this.props;

    return (
      <div className='natural-btn-container text-center'>
        {step !== 0 &&
        <Button
          name='transparent'
          type='button'
          onClick={prevStep}
          className='mb-3 mb-sm-0'
          colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.button}
        >
          { intl.formatMessage({
            id: 'dashboard.kyc.conrols.previousButtonText',
            defaultMessage: 'Previous step',
          })}
        </Button>
        }
        {step === stepsCount - 1 ?
          <Button
            name='white'
            type='button'
            onClick={submit}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.button}
          >
            { intl.formatMessage({
              id: 'dashboard.kyc.conrols.confirmKYCButtonText',
              defaultMessage: 'Confirm KYC',
            })}
          </Button>
          :
          <Button
            name='sell'
            type='button'
            onClick={nextStep}
            colors={this.counterpartyAccountStore.isAgent && this.colorStore.styles.button}
          >
            { intl.formatMessage({
              id: 'dashboard.kyc.conrols.nextButtonText',
              defaultMessage: 'Next step',
            })}
          </Button>
        }
      </div>
    );
  }
}

export default injectIntl(Controls);